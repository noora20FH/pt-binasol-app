<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('film_platforms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('film_id')
                  ->constrained('films')
                  ->onDelete('cascade');

            $table->string('platform_name');
            $table->string('url');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('film_platforms');
    }
};
