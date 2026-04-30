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
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('category_skills_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories_skills')->onDelete('cascade');
            $table->foreignId('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_skills_technologies');
        Schema::dropIfExists('categories_skills');
    }
};