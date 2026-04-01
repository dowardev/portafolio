<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
            if (!Schema::hasColumn('homepage', 'stack')) {
                $table->json('stack')->nullable()->after('socials');
            }
            if (!Schema::hasColumn('homepage', 'skill_categories')) {
                $table->json('skill_categories')->nullable()->after('stack');
            }
            if (!Schema::hasColumn('homepage', 'experience')) {
                $table->json('experience')->nullable()->after('skill_categories');
            }
            if (!Schema::hasColumn('homepage', 'projects')) {
                $table->json('projects')->nullable()->after('experience');
            }
            if (!Schema::hasColumn('homepage', 'certificates')) {
                $table->json('certificates')->nullable()->after('projects');
            }
            if (!Schema::hasColumn('homepage', 'freelance')) {
                $table->json('freelance')->nullable()->after('certificates');
            }
        });
    }

    public function down(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
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
};
