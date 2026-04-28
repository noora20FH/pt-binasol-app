<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($o) => [
                'id'               => $o->id,
                'order_number'     => $o->order_number,
                'customer_name'    => $o->customer_name,
                'customer_email'   => $o->customer_email,
                'customer_address' => $o->customer_address,
                'total_amount'     => $o->total_amount,
                'payment_status'   => $o->payment_status,
                'payment_type'     => $o->payment_type,
                'snap_token'       => $o->snap_token,
                'created_at'       => $o->created_at?->toIso8601String(),
                'updated_at'       => $o->updated_at?->toIso8601String(),
                'items'            => $o->items->map(fn($item) => [
                    'id'           => $item->id,
                    'order_id'     => $item->order_id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product?->name,
                    'quantity'     => $item->quantity,
                    'price'        => $item->price,
                ])->toArray(),
            ]);

        // Stats
        $stats = [
            'total'   => $orders->count(),
            'lunas'   => $orders->where('payment_status', 'settlement')->count(),
            'pending' => $orders->where('payment_status', 'pending')->count(),
            'revenue' => $orders->where('payment_status', 'settlement')->sum('total_amount'),
        ];

        return Inertia::render('Admin/OrderManagement', [
            'orders' => $orders,
            'stats'  => $stats,
        ]);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Order berhasil dihapus!');
    }
}
