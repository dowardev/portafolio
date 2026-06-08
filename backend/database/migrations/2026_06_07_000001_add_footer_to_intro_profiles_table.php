<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intro_profiles', function (Blueprint $table) {
            $table->boolean('show_footer')->default(true)->after('photo_url');
            $table->text('footer_content')->nullable()->after('show_footer');
        });
    }

    public function down(): void
    {
        Schema::table('intro_profiles', function (Blueprint $table) {
            $table->dropColumn(['show_footer', 'footer_content']);
        });
    }
};
