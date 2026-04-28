<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('total_amount', 12, 2);
            $table->enum('payment_status', ['pending', 'settlement', 'expire', 'cancel'])->default('pending');
            $table->string('payment_type')->nullable();
            $table->string('snap_token')->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->text('customer_address');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
