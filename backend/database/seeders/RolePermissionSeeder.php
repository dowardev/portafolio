<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Poblar catálogo de permisos
        $permissions = [
            ['slug' => 'posts.index', 'module' => 'posts', 'action' => 'index'],
            ['slug' => 'posts.create', 'module' => 'posts', 'action' => 'create'],
            ['slug' => 'posts.update', 'module' => 'posts', 'action' => 'update'],
            ['slug' => 'posts.delete', 'module' => 'posts', 'action' => 'delete'],
            ['slug' => 'intro.index', 'module' => 'intro', 'action' => 'index'],
            ['slug' => 'intro.update', 'module' => 'intro', 'action' => 'update'],
            ['slug' => 'experiences.index', 'module' => 'experiences', 'action' => 'index'],
            ['slug' => 'experiences.create', 'module' => 'experiences', 'action' => 'create'],
            ['slug' => 'experiences.update', 'module' => 'experiences', 'action' => 'update'],
            ['slug' => 'experiences.delete', 'module' => 'experiences', 'action' => 'delete'],
            ['slug' => 'projects.index', 'module' => 'projects', 'action' => 'index'],
            ['slug' => 'projects.create', 'module' => 'projects', 'action' => 'create'],
            ['slug' => 'projects.update', 'module' => 'projects', 'action' => 'update'],
            ['slug' => 'projects.delete', 'module' => 'projects', 'action' => 'delete'],
            ['slug' => 'certificates.index', 'module' => 'certificates', 'action' => 'index'],
            ['slug' => 'certificates.create', 'module' => 'certificates', 'action' => 'create'],
            ['slug' => 'certificates.update', 'module' => 'certificates', 'action' => 'update'],
            ['slug' => 'certificates.delete', 'module' => 'certificates', 'action' => 'delete'],
            ['slug' => 'freelance.index', 'module' => 'freelance', 'action' => 'index'],
            ['slug' => 'freelance.create', 'module' => 'freelance', 'action' => 'create'],
            ['slug' => 'freelance.update', 'module' => 'freelance', 'action' => 'update'],
            ['slug' => 'freelance.delete', 'module' => 'freelance', 'action' => 'delete'],
            ['slug' => 'freelance-comments.index', 'module' => 'freelance-comments', 'action' => 'index'],
            ['slug' => 'freelance-comments.create', 'module' => 'freelance-comments', 'action' => 'create'],
            ['slug' => 'freelance-comments.update', 'module' => 'freelance-comments', 'action' => 'update'],
            ['slug' => 'freelance-comments.delete', 'module' => 'freelance-comments', 'action' => 'delete'],
            ['slug' => 'stacks.index', 'module' => 'stacks', 'action' => 'index'],
            ['slug' => 'stacks.create', 'module' => 'stacks', 'action' => 'create'],
            ['slug' => 'stacks.update', 'module' => 'stacks', 'action' => 'update'],
            ['slug' => 'stacks.delete', 'module' => 'stacks', 'action' => 'delete'],
            ['slug' => 'skills-categories.index', 'module' => 'skills-categories', 'action' => 'index'],
            ['slug' => 'skills-categories.create', 'module' => 'skills-categories', 'action' => 'create'],
            ['slug' => 'skills-categories.update', 'module' => 'skills-categories', 'action' => 'update'],
            ['slug' => 'skills-categories.delete', 'module' => 'skills-categories', 'action' => 'delete'],
        ];

        Permission::truncate();

        foreach ($permissions as $perm) {
            Permission::create($perm);
        }

        // Poblar permisos por rol
        RolePermission::whereNotNull('role_slug')->delete();

        $adminPermissions = [
            'certificates.create', 'certificates.update', 'certificates.delete', 'certificates.index',
            'experiences.create', 'experiences.update', 'experiences.delete', 'experiences.index',
            'freelance.create', 'freelance.update', 'freelance.delete', 'freelance.index',
            'freelance-comments.create', 'freelance-comments.update', 'freelance-comments.delete', 'freelance-comments.index',
            'intro.update', 'intro.index',
            'posts.create', 'posts.update', 'posts.delete', 'posts.index',
            'projects.create', 'projects.update', 'projects.delete', 'projects.index',
            'skills-categories.create', 'skills-categories.update', 'skills-categories.delete', 'skills-categories.index',
            'stacks.create', 'stacks.update', 'stacks.delete', 'stacks.index',
        ];

        foreach ($adminPermissions as $slug) {
            RolePermission::create([
                'role_slug' => 'admin',
                'permission_slug' => $slug,
            ]);
        }

        $editorPermissions = [
            'certificates.create', 'certificates.update', 'certificates.index',
            'experiences.create', 'experiences.update', 'experiences.index',
            'freelance.create', 'freelance.update', 'freelance.index',
            'freelance-comments.create', 'freelance-comments.update', 'freelance-comments.index',
            'intro.update', 'intro.index',
            'posts.create', 'posts.update', 'posts.index',
            'projects.create', 'projects.update', 'projects.index',
            'skills-categories.create', 'skills-categories.update', 'skills-categories.index',
            'stacks.create', 'stacks.update', 'stacks.index',
        ];

        foreach ($editorPermissions as $slug) {
            RolePermission::create([
                'role_slug' => 'editor',
                'permission_slug' => $slug,
            ]);
        }

        $viewerPermissions = [
            'certificates.index',
            'experiences.index',
            'freelance.index',
            'freelance-comments.index',
            'intro.index',
            'posts.index',
            'projects.index',
            'skills-categories.index',
            'stacks.index',
        ];

        foreach ($viewerPermissions as $slug) {
            RolePermission::create([
                'role_slug' => 'viewer',
                'permission_slug' => $slug,
            ]);
        }
    }
}