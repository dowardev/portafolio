<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
            $table->boolean('show_contact_form')->nullable()->default(false)->after('reviews');
        });
    }

    public function down(): void
    {
        Schema::table('homepage', function (Blueprint $table) {
            $table->dropColumn('show_contact_form');
        });
    }
};