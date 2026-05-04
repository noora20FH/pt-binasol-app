<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return inertia('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);

        return inertia('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_number' => 'required|string|unique:orders',
            'user_id' => 'nullable|exists:users,id',
            'total_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:pending,settlement,expire,cancel',
            'payment_type' => 'nullable|string',
            'snap_token' => 'nullable|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        $order = Order::create($validated);

        foreach ($items as $item) {
            $order->items()->create($item);
        }

        return redirect()->back();
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,settlement,expire,cancel',
            'payment_type' => 'nullable|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
        ]);

        $order->update($validated);

        return redirect()->back();
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->back();
    }

    /**
     * Get orders for authenticated customer
     */
    public function userOrders()
    {
        $user = auth()->user();
        
        $orders = Order::with(['items.product.images'])
            ->where('user_id', $user->id)
            ->orWhere(function ($query) use ($user) {
                $query->whereNull('user_id')
                    ->where('customer_email', $user->email);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show order detail for customer
     */
    public function userShow(Order $order)
    {
        $user = auth()->user();
        
        // Check if order belongs to user
        if ($order->user_id !== $user->id && $order->customer_email !== $user->email) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini');
        }

        $order->load(['items.product.images', 'user']);

        // Calculate subtotal, shipping, and tax
        $subtotal = $order->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });
        
        $freeShippingThreshold = 500000;
        $shipping = $subtotal >= $freeShippingThreshold ? 0 : 25000;
        $tax = $order->total_amount - $subtotal - $shipping;

        return inertia('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'created_at' => $order->created_at,
                'total_amount' => $order->total_amount,
                'payment_status' => $order->payment_status,
                'payment_type' => $order->payment_type,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => '', // Not stored in db yet
                'customer_address' => $order->customer_address,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'image' => $item->product->images->first()?->image_path,
                    ];
                }),
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
            ],
        ]);
    }
}
