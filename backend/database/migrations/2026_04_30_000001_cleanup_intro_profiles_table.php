<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intro_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'stack',
                'skill_categories',
                'experience',
                'projects',
                'certificates',
                'freelance',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('intro_profiles', function (Blueprint $table) {
            $table->json('stack')->nullable();
            $table->json('skill_categories')->nullable();
            $table->json('experience')->nullable();
            $table->json('projects')->nullable();
            $table->json('certificates')->nullable();
            $table->json('freelance')->nullable();
        });
    }
};