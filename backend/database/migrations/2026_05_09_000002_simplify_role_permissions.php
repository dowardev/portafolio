<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $hasPermissionId = Schema::hasColumn('role_permissions', 'permission_id');
        
        if ($hasPermissionId) {
            try {
                $fkExists = \DB::select("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'role_permissions' AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = 'role_permissions_permission_id_foreign'");
                if (!empty($fkExists)) {
                    Schema::table('role_permissions', fn($t) => $t->dropForeign(['permission_id']));
                }
            } catch (\Exception $e) {}
            
            try {
                Schema::table('role_permissions', fn($t) => $t->dropColumn('permission_id'));
            } catch (\Exception $e) {}
        }

        if (!Schema::hasColumn('role_permissions', 'permission_slug')) {
            try {
                Schema::table('role_permissions', function (Blueprint $table) {
                    $table->string('permission_slug', 100)->after('role_slug');
                });
            } catch (\Exception $e) {}
        }

        if ($hasPermissionId) {
            try {
                Schema::table('role_permissions', fn($t) => $t->dropUnique(['role_slug', 'permission_id']));
            } catch (\Exception $e) {}
        }

        try {
            $sm = Schema::getConnection()->getSchemaBuilder();
            if (!$sm->hasIndex('role_permissions', 'role_permissions_role_slug_permission_slug_unique')) {
                Schema::table('role_permissions', fn($t) => $t->unique(['role_slug', 'permission_slug']));
            }
        } catch (\Exception $e) {}

        if (!Schema::hasTable('permissions')) {
            Schema::create('permissions', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 100)->unique();
                $table->string('module', 50);
                $table->string('action', 50);
                $table->timestamps();
            });
        }
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