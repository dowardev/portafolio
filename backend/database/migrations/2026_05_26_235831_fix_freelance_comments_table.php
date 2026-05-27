<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('freelance_comments', function (Blueprint $table) {
            $table->renameColumn('nullable', 'text');
            $table->foreignId('platform_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('freelance_comments', function (Blueprint $table) {
            $table->renameColumn('text', 'nullable');
            $table->foreignId('platform_id')->nullable(false)->change();
        });
    }
};
