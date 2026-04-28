<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->nullable();
            $table->string('capacity')->nullable();
            $table->string('size')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('price_unit')->nullable()->comment('per jam, per hari, dll');
            $table->json('facilities')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order_priority')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
