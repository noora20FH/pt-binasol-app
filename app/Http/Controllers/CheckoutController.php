<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page
     */
    public function index()
    {
        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('cart.view')->with('error', 'Keranjang belanja Anda kosong');
        }

        $cartItems = [];
        $subtotal = 0;

        foreach ($cart as $productId => $quantity) {
            $product = Product::with('images')->find($productId);
            if ($product) {
                $itemTotal = $product->price * $quantity;
                $cartItems[] = [
                    'id' => $product->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'image' => $product->images->first()?->image_url,
                    'total' => $itemTotal,
                ];
                $subtotal += $itemTotal;
            }
        }

        // Calculate shipping and tax
        $freeShippingThreshold = 500000;
        $shipping = $subtotal >= $freeShippingThreshold ? 0 : 25000;
        $tax = round($subtotal * 0.11); // PPN 11%
        $total = $subtotal + $shipping + $tax;

        $user = auth()->user();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'customer' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }

    /**
     * Process the checkout and create order
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'payment_method' => 'required|in:bank_transfer,e_wallet,cod',
            'notes' => 'nullable|string',
        ]);

        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang belanja kosong',
            ], 400);
        }

        // Calculate totals
        $subtotal = 0;
        $cartItems = [];

        foreach ($cart as $productId => $quantity) {
            $product = Product::find($productId);
            if ($product) {
                $cartItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ];
                $subtotal += $product->price * $quantity;
            }
        }

        $freeShippingThreshold = 500000;
        $shipping = $subtotal >= $freeShippingThreshold ? 0 : 25000;
        $tax = round($subtotal * 0.11);
        $total = $subtotal + $shipping + $tax;

        // Create order
        $order = Order::create([
            'order_number' => 'ORD-' . date('Y') . '-' . strtoupper(Str::random(6)),
            'user_id' => auth()->id(),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_address' => $validated['customer_address'] . ', ' . $validated['city'] . ' ' . $validated['postal_code'],
            'total_amount' => $total,
            'payment_status' => 'pending',
            'payment_type' => $validated['payment_method'],
            'snap_token' => null, // Will be generated when payment is initiated
        ]);

        // Create order items
        foreach ($cartItems as $item) {
            $order->items()->create($item);
        }

        // Clear cart
        session()->forget('cart');

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat',
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'payment_status' => $order->payment_status,
            ],
        ]);
    }
}
