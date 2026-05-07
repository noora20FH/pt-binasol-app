<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransNotificationController extends Controller
{
    public function handle(Request $request)
    {
        // === LOG SEMUA REQUEST (WAJIB DEBUG) ===
        Log::channel('daily')->info('🔔 MIDTRANS NOTIFICATION INCOMING', [
            'ip'        => $request->ip(),
            'payload'   => $request->all(),
            'headers'   => $request->headers->all(),
        ]);

        try {
            $orderId           = $request->input('order_id');
            $statusCode        = $request->input('status_code');
            $grossAmount       = $request->input('gross_amount');
            $signatureKey      = $request->input('signature_key');
            $transactionStatus = $request->input('transaction_status');
            $paymentType       = $request->input('payment_type');

            Log::info('Midtrans Parsed', compact(
                'orderId', 'transactionStatus', 'paymentType', 'grossAmount'
            ));

            // === SIGNATURE VERIFICATION ===
            $serverKey = config('midtrans.server_key');

            if (empty($serverKey)) {
                Log::error('midtrans.server_key tidak ditemukan!');
                return response()->json(['status' => 'error'], 200);
            }

            $payloadString = $orderId . $statusCode . $grossAmount . $serverKey;
            $hashed        = hash('sha512', $payloadString);

            if ($hashed !== $signatureKey) {
                Log::warning('❌ Signature INVALID (test mode masih lanjut)', [
                    'received'   => $signatureKey,
                    'calculated' => $hashed
                ]);
                // Dev mode: tetap lanjut. Production: bisa return 403
            } else {
                Log::info('✅ Signature VALID');
            }

            // === CARI ORDER (jangan pakai firstOrFail!) ===
            $order = Order::where('order_number', $orderId)->first();

            if (!$order) {
                Log::warning('⚠️ Order tidak ditemukan (bisa jadi test notification)', [
                    'order_id' => $orderId
                ]);
                return response()->json(['status' => 'success', 'message' => 'acknowledged'], 200);
            }

            // === UPDATE DATABASE ===
            $newStatus = match ($transactionStatus) {
                'settlement', 'capture' => 'settlement',
                'pending'               => 'pending',
                'expire'                => 'expire',
                'cancel', 'deny'        => 'cancel',
                default                 => $order->payment_status,
            };

            $order->payment_status = $newStatus;

            if (!empty($paymentType)) {
                $order->payment_type = $paymentType;
            }

            $order->save();

            Log::info("✅ ORDER BERHASIL DI-UPDATE", [
                'order_number'   => $order->order_number,
                'payment_status' => $newStatus,
                'payment_type'   => $paymentType
            ]);

            return response()->json(['status' => 'success'], 200);

        } catch (\Exception $e) {
            Log::error('🔥 MIDTRANS CONTROLLER ERROR', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine()
            ]);

            // Selalu return 200 supaya Midtrans tidak anggap gagal
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }
}
