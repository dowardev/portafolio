<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_admin', 'role', 'is_user_disabled', 'sso_id']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('is_admin')->default(0)->after('id');
            $table->string('role')->nullable()->after('is_admin');
            $table->boolean('is_user_disabled')->default(false)->after('role');
            $table->unsignedBigInteger('sso_id')->nullable()->after('id');
        });
    }
};
