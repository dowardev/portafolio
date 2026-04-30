<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('socials', function (Blueprint $table) {
            $table->foreignId('icon_id')->nullable()->constrained('icons')->onDelete('cascade');
            $table->dropColumn('icon_name');
        });
    }

    public function down(): void
    {
        Schema::table('socials', function (Blueprint $table) {
            $table->string('icon_name')->nullable();
            $table->dropForeign(['icon_id']);
            $table->dropColumn('icon_id');
        });
    }
};