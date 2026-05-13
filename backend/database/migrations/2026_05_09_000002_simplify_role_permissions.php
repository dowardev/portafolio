<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('role_permissions', function (Blueprint $table) {
            // Only drop foreign key and column if permission_id exists
            if (Schema::hasColumn('role_permissions', 'permission_id')) {
                $table->dropForeign(['permission_id']);
                $table->dropColumn('permission_id');
            }

            // Only add permission_slug if it doesn't exist
            if (!Schema::hasColumn('role_permissions', 'permission_slug')) {
                $table->string('permission_slug', 100)->after('role_slug');
            }

            // Only drop old unique if permission_id column exists
            if (Schema::hasColumn('role_permissions', 'permission_id')) {
                $table->dropUnique(['role_slug', 'permission_id']);
            }

            // Add new unique constraint only if it doesn't exist
            $sm = Schema::getConnection()->getSchemaBuilder();
            if (!$sm->hasIndex('role_permissions', 'role_permissions_role_slug_permission_slug_unique')) {
                $table->unique(['role_slug', 'permission_slug']);
            }
        });

        // Recreate permissions table as editable catalog (slug, module, action)
        // Only create if it doesn't exist
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