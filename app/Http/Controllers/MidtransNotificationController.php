<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransNotificationController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('🔴 Midtrans Notification Received', $request->all());

        $serverKey = config('midtrans.server_key');

        $orderId       = $request->input('order_id');
        $statusCode    = $request->input('status_code');
        $grossAmount   = $request->input('gross_amount');
        $signatureKey  = $request->input('signature_key');
        $transactionStatus = $request->input('transaction_status');
        $paymentType   = $request->input('payment_type');

        // Signature verification
        $hashed = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($hashed !== $signatureKey) {
            Log::warning('❌ Midtrans signature invalid', [
                'order_id' => $orderId,
                'received' => $signatureKey,
                'calculated' => $hashed,
            ]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $order = Order::where('order_number', $orderId)->first();

        if (!$order) {
            Log::error('Order not found', ['order_id' => $orderId]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update status & payment_type
        $newStatus = match ($transactionStatus) {
            'settlement', 'capture' => 'settlement',
            'pending'               => 'pending',
            'expire'                => 'expire',
            'cancel', 'deny'        => 'cancel',
            default                 => $order->payment_status,
        };

        $order->payment_status = $newStatus;
        if ($paymentType) {
            $order->payment_type = $paymentType;   // qris, bca_va, gopay, dll
        }

        $order->save();

        Log::info("✅ Midtrans webhook SUCCESS: {$order->order_number} → {$newStatus} | {$paymentType}");

        return response()->json(['status' => 'success']);
    }
}
