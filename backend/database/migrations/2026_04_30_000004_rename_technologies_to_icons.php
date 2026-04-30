<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('technologies')) {
            Schema::rename('technologies', 'icons');
        }

        if (Schema::hasTable('icons') && !Schema::hasColumn('icons', 'pack_name')) {
            Schema::table('icons', function (Blueprint $table) {
                $table->string('pack_name')->default('lineicons')->after('name');
            });
        }

        if (Schema::hasTable('project_technologies')) {
            Schema::rename('project_technologies', 'project_icons');
            Schema::table('project_icons', function (Blueprint $table) {
                $table->renameColumn('technology_id', 'icon_id');
            });
        }

        if (Schema::hasTable('experience_technologies')) {
            Schema::rename('experience_technologies', 'experience_icons');
            Schema::table('experience_icons', function (Blueprint $table) {
                $table->renameColumn('technology_id', 'icon_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('experience_icons')) {
            Schema::table('experience_icons', function (Blueprint $table) {
                $table->renameColumn('icon_id', 'technology_id');
            });
            Schema::rename('experience_icons', 'experience_technologies');
        }

        if (Schema::hasTable('project_icons')) {
            Schema::table('project_icons', function (Blueprint $table) {
                $table->renameColumn('icon_id', 'technology_id');
            });
            Schema::rename('project_icons', 'project_technologies');
        }

        if (Schema::hasTable('icons') && Schema::hasColumn('icons', 'pack_name')) {
            Schema::table('icons', function (Blueprint $table) {
                $table->dropColumn('pack_name');
            });
        }

        if (Schema::hasTable('icons')) {
            Schema::rename('icons', 'technologies');
        }
    }
};