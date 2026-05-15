<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('freelance_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('platform_id')->constrained('freelance_platforms')->onDelete('cascade');
            $table->string('title');
            $table->text('nullable')->nullable();
            $table->integer('rating')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('freelance_comments');
    }
};