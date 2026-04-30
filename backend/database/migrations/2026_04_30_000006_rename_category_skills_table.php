<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('category_skills_technologies', 'category_skills_icons');

        Schema::table('category_skills_icons', function (Blueprint $table) {
            $table->renameColumn('technology_id', 'icon_id');
        });
    }

    public function down(): void
    {
        Schema::table('category_skills_icons', function (Blueprint $table) {
            $table->renameColumn('icon_id', 'technology_id');
        });

        Schema::rename('category_skills_icons', 'category_skills_technologies');
    }
};