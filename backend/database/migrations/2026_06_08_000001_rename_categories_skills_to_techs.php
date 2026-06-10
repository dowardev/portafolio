<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('categories_skills', 'techs');

        Schema::table('techs', function (Blueprint $table) {
            $table->foreignId('stack_id')->nullable()->constrained('stacks')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('techs', function (Blueprint $table) {
            $table->dropForeign(['stack_id']);
            $table->dropColumn('stack_id');
        });

        Schema::rename('techs', 'categories_skills');
    }
};
