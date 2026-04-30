<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
public function index()
    {
        $orders = Order::with(['items.product'])  // Eager loading agar tidak N+1 query
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id'                => $order->id,
                    'order_number'      => $order->order_number,
                    'customer_name'     => $order->customer_name,
                    'customer_email'    => $order->customer_email,
                    'customer_address'  => $order->customer_address,
                    'total_amount'      => $order->total_amount,
                    'payment_status'    => $order->payment_status,
                    'payment_type'      => $order->payment_type,
                    'snap_token'        => $order->snap_token,
                    'created_at'        => $order->created_at?->toIso8601String(),
                    'updated_at'        => $order->updated_at?->toIso8601String(),
                    'items'             => $order->items->map(function ($item) {
                        return [
                            'id'            => $item->id,
                            'order_id'      => $item->order_id,
                            'product_id'    => $item->product_id,
                            'product_name'  => $item->product?->name ?? 'Produk Dihapus',
                            'quantity'      => $item->quantity,
                            'price'         => $item->price,
                        ];
                    })->toArray(),
                ];
            });

        // Stats untuk card di OrderManagement.jsx
        $stats = [
            'total'    => $orders->count(),
            'lunas'    => $orders->where('payment_status', 'settlement')->count(),
            'pending'  => $orders->where('payment_status', 'pending')->count(),
            'revenue'  => $orders->where('payment_status', 'settlement')
                                ->sum(fn($o) => (float) $o['total_amount']),
        ];

        return Inertia::render('Admin/OrderManagement', [
            'orders' => $orders,
            'stats'  => $stats,
        ]);
    }

    /**
     * Hapus pesanan (soft delete).
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->back()
            ->with('success', 'Order berhasil dihapus!');
    }
}
