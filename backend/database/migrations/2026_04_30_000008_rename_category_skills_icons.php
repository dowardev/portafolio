<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('categories_skills_icons')) {
            Schema::rename('categories_skills_icons', 'categories_skills_tech');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('categories_skills_tech')) {
            Schema::rename('categories_skills_tech', 'categories_skills_icons');
        }
    }
};