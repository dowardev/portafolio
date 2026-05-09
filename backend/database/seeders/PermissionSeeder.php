<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Posts
            ['slug' => 'posts.index', 'name' => 'Ver posts', 'module' => 'posts'],
            ['slug' => 'posts.create', 'name' => 'Crear post', 'module' => 'posts'],
            ['slug' => 'posts.update', 'name' => 'Actualizar post', 'module' => 'posts'],
            ['slug' => 'posts.delete', 'name' => 'Eliminar post', 'module' => 'posts'],
            // Intro
            ['slug' => 'intro.index', 'name' => 'Ver intro', 'module' => 'intro'],
            ['slug' => 'intro.update', 'name' => 'Actualizar intro', 'module' => 'intro'],
            // Experiences
            ['slug' => 'experiences.index', 'name' => 'Ver experiencias', 'module' => 'experiences'],
            ['slug' => 'experiences.create', 'name' => 'Crear experiencia', 'module' => 'experiences'],
            ['slug' => 'experiences.update', 'name' => 'Actualizar experiencia', 'module' => 'experiences'],
            ['slug' => 'experiences.delete', 'name' => 'Eliminar experiencia', 'module' => 'experiences'],
            // Projects
            ['slug' => 'projects.index', 'name' => 'Ver proyectos', 'module' => 'projects'],
            ['slug' => 'projects.create', 'name' => 'Crear proyecto', 'module' => 'projects'],
            ['slug' => 'projects.update', 'name' => 'Actualizar proyecto', 'module' => 'projects'],
            ['slug' => 'projects.delete', 'name' => 'Eliminar proyecto', 'module' => 'projects'],
            // Certificates
            ['slug' => 'certificates.index', 'name' => 'Ver certificados', 'module' => 'certificates'],
            ['slug' => 'certificates.create', 'name' => 'Crear certificado', 'module' => 'certificates'],
            ['slug' => 'certificates.update', 'name' => 'Actualizar certificado', 'module' => 'certificates'],
            ['slug' => 'certificates.delete', 'name' => 'Eliminar certificado', 'module' => 'certificates'],
            // Freelance
            ['slug' => 'freelance.index', 'name' => 'Ver plataformas freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.create', 'name' => 'Crear plataforma freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.update', 'name' => 'Actualizar plataforma freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.delete', 'name' => 'Eliminar plataforma freelance', 'module' => 'freelance'],
            // Freelance Comments
            ['slug' => 'freelance-comments.index', 'name' => 'Ver comentarios freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.create', 'name' => 'Crear comentario freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.update', 'name' => 'Actualizar comentario freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.delete', 'name' => 'Eliminar comentario freelance', 'module' => 'freelance'],
            // Stacks
            ['slug' => 'stacks.index', 'name' => 'Ver tecnologías', 'module' => 'stacks'],
            ['slug' => 'stacks.create', 'name' => 'Crear tecnología', 'module' => 'stacks'],
            ['slug' => 'stacks.update', 'name' => 'Actualizar tecnología', 'module' => 'stacks'],
            ['slug' => 'stacks.delete', 'name' => 'Eliminar tecnología', 'module' => 'stacks'],
            // Skills Categories
            ['slug' => 'skills-categories.index', 'name' => 'Ver categorías de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.create', 'name' => 'Crear categoría de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.update', 'name' => 'Actualizar categoría de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.delete', 'name' => 'Eliminar categoría de habilidades', 'module' => 'skills-categories'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}