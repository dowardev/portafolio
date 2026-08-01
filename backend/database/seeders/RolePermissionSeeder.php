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
            ['slug' => 'posts.create', 'module' => 'posts', 'action' => 'create', 'description' => 'Crear publicaciones'],
            ['slug' => 'posts.update', 'module' => 'posts', 'action' => 'update', 'description' => 'Editar publicaciones'],
            ['slug' => 'posts.delete', 'module' => 'posts', 'action' => 'delete', 'description' => 'Eliminar publicaciones'],
            ['slug' => 'intro.update', 'module' => 'intro', 'action' => 'update', 'description' => 'Editar información de inicio'],
            ['slug' => 'experiences.create', 'module' => 'experiences', 'action' => 'create', 'description' => 'Crear experiencias'],
            ['slug' => 'experiences.update', 'module' => 'experiences', 'action' => 'update', 'description' => 'Editar experiencias'],
            ['slug' => 'experiences.delete', 'module' => 'experiences', 'action' => 'delete', 'description' => 'Eliminar experiencias'],
            ['slug' => 'projects.create', 'module' => 'projects', 'action' => 'create', 'description' => 'Crear proyectos'],
            ['slug' => 'projects.update', 'module' => 'projects', 'action' => 'update', 'description' => 'Editar proyectos'],
            ['slug' => 'projects.delete', 'module' => 'projects', 'action' => 'delete', 'description' => 'Eliminar proyectos'],
            ['slug' => 'certificates.create', 'module' => 'certificates', 'action' => 'create', 'description' => 'Crear certificados'],
            ['slug' => 'certificates.update', 'module' => 'certificates', 'action' => 'update', 'description' => 'Editar certificados'],
            ['slug' => 'certificates.delete', 'module' => 'certificates', 'action' => 'delete', 'description' => 'Eliminar certificados'],
            ['slug' => 'freelance.create', 'module' => 'freelance', 'action' => 'create', 'description' => 'Crear plataformas freelance'],
            ['slug' => 'freelance.update', 'module' => 'freelance', 'action' => 'update', 'description' => 'Editar plataformas freelance'],
            ['slug' => 'freelance.delete', 'module' => 'freelance', 'action' => 'delete', 'description' => 'Eliminar plataformas freelance'],
            ['slug' => 'freelance-comments.create', 'module' => 'freelance-comments', 'action' => 'create', 'description' => 'Crear comentarios freelance'],
            ['slug' => 'freelance-comments.update', 'module' => 'freelance-comments', 'action' => 'update', 'description' => 'Editar comentarios freelance'],
            ['slug' => 'freelance-comments.delete', 'module' => 'freelance-comments', 'action' => 'delete', 'description' => 'Eliminar comentarios freelance'],
            ['slug' => 'stacks.create', 'module' => 'stacks', 'action' => 'create', 'description' => 'Crear tecnologías del stack'],
            ['slug' => 'stacks.update', 'module' => 'stacks', 'action' => 'update', 'description' => 'Editar tecnologías del stack'],
            ['slug' => 'stacks.delete', 'module' => 'stacks', 'action' => 'delete', 'description' => 'Eliminar tecnologías del stack'],
            ['slug' => 'techs.create', 'module' => 'techs', 'action' => 'create', 'description' => 'Crear tecnologías'],
            ['slug' => 'techs.update', 'module' => 'techs', 'action' => 'update', 'description' => 'Editar tecnologías'],
            ['slug' => 'techs.delete', 'module' => 'techs', 'action' => 'delete', 'description' => 'Eliminar tecnologías'],
        ];

        Permission::upsert($permissions, ['slug'], ['module', 'action', 'description']);

        // Limpiar permisos huérfanos del modelo anterior skills-categories
        Permission::where('slug', 'like', 'skills-categories.%')->delete();

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
            'techs.create', 'techs.update', 'techs.delete',
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
            'techs.create', 'techs.update',
            'stacks.create', 'stacks.update',
        ];

        foreach ($editorPermissions as $slug) {
            $rolePermissions[] = ['role_slug' => 'editor', 'permission_slug' => $slug];
        }

        RolePermission::upsert($rolePermissions, ['role_slug', 'permission_slug'], ['role_slug', 'permission_slug']);

        // Viewer no tiene permisos de gestión (solo acceso público a contenido)
    }
}
