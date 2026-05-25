<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories_skills', function (Blueprint $table) {
            $table->foreignId('icon_id')->nullable()->constrained('icons')->nullOnDelete();
            $table->integer('sort_order')->default(0);
        });

        Schema::dropIfExists('categories_skills_tech');
    }

    public function down(): void
    {
        Schema::create('categories_skills_tech', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories_skills')->onDelete('cascade');
            $table->foreignId('icon_id')->constrained('icons')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::table('categories_skills', function (Blueprint $table) {
            $table->dropForeign(['icon_id']);
            $table->dropColumn(['icon_id', 'sort_order']);
        });
    }
};
