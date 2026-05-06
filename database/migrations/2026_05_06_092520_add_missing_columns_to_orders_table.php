<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Kolom yang sudah dipakai di CheckoutController tapi belum ada di tabel
            $table->string('customer_phone', 20)->nullable()->after('customer_email');

            // Catatan pelanggan (opsional)
            $table->text('notes')->nullable()->after('customer_address');

            // Kolom breakdown harga (sangat penting untuk Midtrans & laporan)
            $table->decimal('subtotal', 12, 2)->default(0)->after('total_amount');
            $table->decimal('shipping_fee', 12, 2)->default(0)->after('subtotal');
            $table->decimal('tax_amount', 12, 2)->default(0)->after('shipping_fee');

            // Index untuk performa
            $table->index('payment_status');
            $table->index(['user_id', 'payment_status']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_phone',
                'notes',
                'subtotal',
                'shipping_fee',
                'tax_amount',
            ]);
        });
    }
};
