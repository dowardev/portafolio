<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('role_permissions', function (Blueprint $table) {
            $table->dropForeign(['permission_id']);
            $table->dropColumn('permission_id');
            $table->string('permission_slug', 100)->after('role_slug');
            $table->dropUnique(['role_slug', 'permission_id']);
            $table->unique(['role_slug', 'permission_slug']);
        });

        // Recreate permissions table as editable catalog (slug, module, action)
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('module', 50);
            $table->string('action', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Note: data in role_permissions will be lost when converting back to permission_id FK
        Schema::dropIfExists('permissions');

        Schema::table('role_permissions', function (Blueprint $table) {
            $table->dropUnique(['role_slug', 'permission_slug']);
            $table->dropColumn('permission_slug');
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->unique(['role_slug', 'permission_id']);
        });
    }
};