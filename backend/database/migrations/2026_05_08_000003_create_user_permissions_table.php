<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('user_sso_id', 36);
            $table->string('permission_slug', 100);
            $table->enum('type', ['grant', 'deny']);
            $table->timestamps();
            $table->unique(['user_sso_id', 'permission_slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};
