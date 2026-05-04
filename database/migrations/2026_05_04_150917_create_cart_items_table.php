<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->nullable(); // snapshot harga saat ditambahkan
            $table->timestamps();

            // Satu produk hanya boleh sekali di dalam 1 keranjang
            $table->unique(['cart_id', 'product_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cart_items');
    }
};
