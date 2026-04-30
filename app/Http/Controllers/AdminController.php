<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Total Film
        $totalFilms = Film::count();

        // Produk Retail (berdasarkan category type = 'retail')
        $totalRetail = Product::whereHas('category', function ($query) {
            $query->where('type', 'retail');
        })->count();

        // Produk Konstruksi (berdasarkan category type = 'construction')
        $totalConstruction = Product::whereHas('category', function ($query) {
            $query->where('type', 'construction');
        })->count();

        // Total Order
        $totalOrders = Order::count();

        // Recent Orders (5 terbaru – sesuai format yang dipakai di Dashboard.jsx)
        $recentOrders = Order::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id'        => $order->order_number,
                    'customer'  => $order->customer_name,
                    'amount'    => 'Rp ' . number_format($order->total_amount ?? 0, 0, ',', '.'),
                    'status'    => $order->payment_status,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'totalFilms'        => $totalFilms,
            'totalRetail'       => $totalRetail,
            'totalConstruction' => $totalConstruction,
            'totalOrders'       => $totalOrders,
            'recentOrders'      => $recentOrders,
        ]);
    }
}
