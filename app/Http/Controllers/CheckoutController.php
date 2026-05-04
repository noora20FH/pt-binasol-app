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
            return response()->json([
                'success' => false,
                'message' => 'Keranjang belanja kosong',
            ], 400);
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
                'customer_name'    => $validated['customer_name'],
                'customer_email'   => $validated['customer_email'],
                'customer_phone'   => $validated['customer_phone'],   // ← disimpan (pastikan kolom ada)
                'customer_address' => $fullAddress,
                'total_amount'     => $total,
                'payment_status'   => 'pending',
                'payment_type'     => $validated['payment_method'],
                'notes'            => $validated['notes'] ?? null,
            ]);

            // Simpan order items dari cart_items
            foreach ($cartData['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            // Kosongkan keranjang (DB-based)
            $this->cartService->clearCart($request);

            DB::commit();
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order' => [
                        'id'            => $order->id,
                        'order_number'  => $order->order_number,
                        'total_amount'  => $order->total_amount,
                        'payment_status' => $order->payment_status,
                    ],
                ]);
            }

            // Fallback untuk Inertia
            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Pesanan berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
            ], 500);
        }
    }
}
