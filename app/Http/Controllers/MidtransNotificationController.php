<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransNotificationController extends Controller
{
    public function handle(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash('sha512',
            $request->order_id .
            $request->status_code .
            $request->gross_amount .
            $serverKey
        );

        if ($hashed !== $request->signature_key) {
            Log::warning('Midtrans signature invalid');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $order = Order::where('order_number', $request->order_id)->first();

        if (!$order) {
            Log::error('Order not found: ' . $request->order_id);
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update status
        $order->payment_status = match($request->transaction_status) {
            'settlement', 'capture' => 'settlement',
            'pending'               => 'pending',
            'deny', 'expire', 'cancel' => 'expire',
            default => $order->payment_status,
        };

        $order->payment_type = $request->payment_type ?? $order->payment_type;
        $order->save();

        Log::info("Midtrans webhook: Order {$order->order_number} → {$order->payment_status}");

        return response()->json(['status' => 'success']);
    }
}
