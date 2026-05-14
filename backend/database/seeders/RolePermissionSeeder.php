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
            ['slug' => 'posts.create', 'module' => 'posts', 'action' => 'create'],
            ['slug' => 'posts.update', 'module' => 'posts', 'action' => 'update'],
            ['slug' => 'posts.delete', 'module' => 'posts', 'action' => 'delete'],
            ['slug' => 'intro.update', 'module' => 'intro', 'action' => 'update'],
            ['slug' => 'experiences.create', 'module' => 'experiences', 'action' => 'create'],
            ['slug' => 'experiences.update', 'module' => 'experiences', 'action' => 'update'],
            ['slug' => 'experiences.delete', 'module' => 'experiences', 'action' => 'delete'],
            ['slug' => 'projects.create', 'module' => 'projects', 'action' => 'create'],
            ['slug' => 'projects.update', 'module' => 'projects', 'action' => 'update'],
            ['slug' => 'projects.delete', 'module' => 'projects', 'action' => 'delete'],
            ['slug' => 'certificates.create', 'module' => 'certificates', 'action' => 'create'],
            ['slug' => 'certificates.update', 'module' => 'certificates', 'action' => 'update'],
            ['slug' => 'certificates.delete', 'module' => 'certificates', 'action' => 'delete'],
            ['slug' => 'freelance.create', 'module' => 'freelance', 'action' => 'create'],
            ['slug' => 'freelance.update', 'module' => 'freelance', 'action' => 'update'],
            ['slug' => 'freelance.delete', 'module' => 'freelance', 'action' => 'delete'],
            ['slug' => 'freelance-comments.create', 'module' => 'freelance-comments', 'action' => 'create'],
            ['slug' => 'freelance-comments.update', 'module' => 'freelance-comments', 'action' => 'update'],
            ['slug' => 'freelance-comments.delete', 'module' => 'freelance-comments', 'action' => 'delete'],
            ['slug' => 'stacks.create', 'module' => 'stacks', 'action' => 'create'],
            ['slug' => 'stacks.update', 'module' => 'stacks', 'action' => 'update'],
            ['slug' => 'stacks.delete', 'module' => 'stacks', 'action' => 'delete'],
            ['slug' => 'skills-categories.create', 'module' => 'skills-categories', 'action' => 'create'],
            ['slug' => 'skills-categories.update', 'module' => 'skills-categories', 'action' => 'update'],
            ['slug' => 'skills-categories.delete', 'module' => 'skills-categories', 'action' => 'delete'],
        ];

        Permission::upsert($permissions, ['slug'], ['module', 'action']);

        // Poblar permisos por rol
        // Nota: Los permisos del admin se usan para la UI del panel de admin.
        // El bypass real del admin ocurre en PermissionMiddleware y PermissionService,
        // donde cualquier usuario con rol 'admin' obtiene todos los permisos automáticamente.

        $rolePermissions = [];

        $adminPermissions = [
            'certificates.create', 'certificates.update', 'certificates.delete',
            'experiences.create', 'experiences.update', 'experiences.delete',
            'freelance.create', 'freelance.update', 'freelance.delete',
            'freelance-comments.create', 'freelance-comments.update', 'freelance-comments.delete',
            'intro.update',
            'posts.create', 'posts.update', 'posts.delete',
            'projects.create', 'projects.update', 'projects.delete',
            'skills-categories.create', 'skills-categories.update', 'skills-categories.delete',
            'stacks.create', 'stacks.update', 'stacks.delete',
        ];

        foreach ($adminPermissions as $slug) {
            $rolePermissions[] = ['role_slug' => 'admin', 'permission_slug' => $slug];
        }

        $editorPermissions = [
            'certificates.create', 'certificates.update',
            'experiences.create', 'experiences.update',
            'freelance.create', 'freelance.update',
            'freelance-comments.create', 'freelance-comments.update',
            'intro.update',
            'posts.create', 'posts.update',
            'projects.create', 'projects.update',
            'skills-categories.create', 'skills-categories.update',
            'stacks.create', 'stacks.update',
        ];

        foreach ($editorPermissions as $slug) {
            $rolePermissions[] = ['role_slug' => 'editor', 'permission_slug' => $slug];
        }

        RolePermission::upsert($rolePermissions, ['role_slug', 'permission_slug'], ['role_slug', 'permission_slug']);

        // Viewer no tiene permisos de gestión (solo acceso público a contenido)
    }
}