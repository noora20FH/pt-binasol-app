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
}
