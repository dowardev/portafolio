<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories_skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('category_skills_tech', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories_skills')->onDelete('cascade');
            $table->foreignId('icon_id')->constrained('icons')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_skills_tech');
        Schema::dropIfExists('categories_skills');
    }
};