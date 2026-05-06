<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Midtrans\Snap;
use Midtrans\Config;

class CheckoutController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Tampilkan halaman Checkout
     */
    public function index()
    {
        $cartData = $this->cartService->getCartData(request());

        if (empty($cartData['items']) || $cartData['count'] === 0) {
            return redirect()->route('cart.view')
                ->with('error', 'Keranjang belanja Anda kosong');
        }

        $subtotal = $cartData['total'];
        $freeShippingThreshold = 500000;
        $shipping = $subtotal >= $freeShippingThreshold ? 0 : 25000;
        $tax = round($subtotal * 0.11);
        $total = $subtotal + $shipping + $tax;

        $user = auth()->user();

        return Inertia::render('Checkout', [
            'cartItems' => $cartData['items'],   // ← sudah full URL dari CartService
            'subtotal'  => $subtotal,
            'shipping'  => $shipping,
            'tax'       => $tax,
            'total'     => $total,
            'customer'  => $user ? [
                'name'  => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }

    /**
     * Proses checkout → buat order
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string',
            'city'             => 'required|string|max:100',
            'postal_code'      => 'required|string|max:10',
            'payment_method'   => 'required|in:bank_transfer,e_wallet,cod',
            'notes'            => 'nullable|string|max:500',
        ]);

        $cartData = $this->cartService->getCartData($request);

        if (empty($cartData['items'])) {
            return response()->json(['success' => false, 'message' => 'Keranjang kosong'], 400);
        }

        $subtotal = $cartData['total'];
        $freeShippingThreshold = 500000;
        $shipping = $subtotal >= $freeShippingThreshold ? 0 : 25000;
        $tax = round($subtotal * 0.11);
        $total = $subtotal + $shipping + $tax;

        $fullAddress = trim($validated['customer_address'] . ', ' . $validated['city'] . ' ' . $validated['postal_code']);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'order_number'     => 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                'user_id'          => auth()->id(),
                'subtotal'         => $subtotal,           // ← tambahkan
                'shipping_fee'     => $shipping,           // ← tambahkan
                'tax_amount'       => $tax,                // ← tambahkan
                'total_amount'     => $total,
                'payment_status'   => 'pending',
                'payment_type'     => $validated['payment_method'],
                'customer_name'    => $validated['customer_name'],
                'customer_email'   => $validated['customer_email'],
                'customer_phone'   => $validated['customer_phone'],
                'customer_address' => $fullAddress,
                'notes'            => $validated['notes'] ?? null,
            ]);

            // Simpan items
            foreach ($cartData['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            $this->cartService->clearCart($request);

            // === MIDTRANS SNAP TOKEN ===
            \Midtrans\Config::$serverKey    = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized  = true;
            \Midtrans\Config::$is3ds        = true;

            $productItems = $cartData['items']->map(fn($item) => [
                'id'       => $item['id'],
                'price'    => (int) $item['price'],
                'quantity' => $item['quantity'],
                'name'     => $item['name'],
            ])->toArray();

            // Tambahkan Shipping dan Pajak sebagai item terpisah
            $item_details = $productItems;

            if ($shipping > 0) {
                $item_details[] = [
                    'id'       => 'SHIPPING',
                    'price'    => (int) $shipping,
                    'quantity' => 1,
                    'name'     => 'Ongkos Kirim',
                ];
            }

            if ($tax > 0) {
                $item_details[] = [
                    'id'       => 'TAX',
                    'price'    => (int) $tax,
                    'quantity' => 1,
                    'name'     => 'PPN 11%',
                ];
            }

            $snapToken = \Midtrans\Snap::getSnapToken([
                'transaction_details' => [
                    'order_id'     => $order->order_number,
                    'gross_amount' => (int) $order->total_amount,   // tetap pakai total
                ],
                'customer_details' => [
                    'first_name' => $validated['customer_name'],
                    'email'      => $validated['customer_email'],
                    'phone'      => $validated['customer_phone'],
                ],
                'item_details' => $item_details,   // ← ini yang diperbaiki
            ]);

            $order->update(['snap_token' => $snapToken]);
            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order' => [
                        'id'            => $order->id,
                        'order_number'  => $order->order_number,
                        'total_amount'  => $order->total_amount,
                        'payment_status' => $order->payment_status,
                        'snap_token'    => $snapToken,   // ← tambahkan ini
                    ],
                ]);
            }

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Pesanan berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Checkout Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan.'], 500);
        }
    }
}
