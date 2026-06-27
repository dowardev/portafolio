<?php

namespace Database\Factories;

use App\Models\Image;
use App\Models\PostImage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
  private static array $pendingImageIds = [];

  public function configure(): static
  {
    return $this->afterCreating(function ($post) {
      $imageIds = array_shift(self::$pendingImageIds) ?? [];
      foreach ($imageIds as $imageId) {
        PostImage::create([
          "post_id" => $post->id,
          "image_id" => $imageId,
        ]);
      }
    });
  }

  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $timestamp = mt_rand(strtotime("2024-01-01"), time());
    $randomDate = date("Y-m-d H:i:s", $timestamp);
    $title = $this->generateTitle();

    $extraImages = Image::factory()
      ->count(mt_rand(2, 4))
      ->disk("posts_images")
      ->create();
    $extraIds = $extraImages->pluck("id")->toArray();
    $extraUrls = $extraImages->map(function ($img) {
      return URL::to(Storage::disk($img->path)->url($img->name));
    })->toArray();

    self::$pendingImageIds[] = $extraIds;

    return [
      "title" => $title,
      "content" => $this->generateMarkdownContent($title, $extraUrls),
      "cover_id" => Image::factory()->disk("posts_images")->create()->id,
      "created_at" => $randomDate,
      "status" => "active",
    ];
  }

  private function generateTitle(): string
  {
    $templates = [
      "Guía completa de {{topic}}",
      "Cómo {{action}} en {{year}}",
      "{{topic}}: Todo lo que necesitas saber",
      "Los mejores consejos para {{action}}",
      "{{topic}} desde cero: Introducción práctica",
      "Por qué {{topic}} está cambiando {{industry}}",
      "{{number}} razones para aprender {{topic}}",
      "Comparativa: {{topic}} vs {{alternative}}",
      "Errores comunes al {{action}} y cómo evitarlos",
      "{{topic}} avanzado: Técnicas y patrones",
    ];

    $template = $this->faker->randomElement($templates);
    $topic = $this->faker->randomElement([
      "Laravel", "Vue.js", "TypeScript", "Docker", "PHP 8",
      "Desarrollo Web", "APIs REST", "Bases de Datos", "SQL",
      "Git", "Linux", "AWS", "Testing", "CI/CD", "Python",
      "JavaScript", "Node.js", "React", "Tailwind CSS", "MySQL",
    ]);
    $alternative = $this->faker->randomElement([
      "React", "Angular", "Svelte", "Express", "Symfony",
      "MongoDB", "PostgreSQL", "Redis", "Figma", "Alpine.js",
    ]);
    $action = $this->faker->randomElement([
      "crear una API REST", "optimizar consultas SQL",
      "desplegar en producción", "automatizar tu workflow",
      "mejorar el rendimiento", "escribir tests unitarios",
      "configurar Docker", "gestionar dependencias",
      "desarrollar con TDD", "hacer deploy continuo",
    ]);
    $number = $this->faker->randomElement(["5", "7", "10", "12", "15"]);
    $industry = $this->faker->randomElement([
      "el desarrollo web", "la nube", "el backend",
      "la industria tech", "el ecosistema PHP",
    ]);
    $year = $this->faker->randomElement(["2024", "2025", "2026"]);

    $replacements = compact("topic", "alternative", "action", "number", "industry", "year");

    $title = $template;
    foreach ($replacements as $key => $value) {
      $title = str_replace("{{" . $key . "}}", (string) $value, $title);
    }

    return $title;
  }

  private function imageTag(string $url): string
  {
    return '<div class="center"><img src="' . $url . '" style="width:80%"/></div>';
  }

  private function generateMarkdownContent(string $title, array $imageUrls = []): string
  {
    $imageIndex = 0;
    $totalImages = count($imageUrls);

    $nextImage = function () use ($imageUrls, &$imageIndex) {
      if ($imageIndex < count($imageUrls)) {
        $url = $imageUrls[$imageIndex];
        $imageIndex++;
        return "\n\n" . $this->imageTag($url) . "\n\n";
      }
      return "";
    };

    $maybeImage = function () use ($nextImage) {
      return mt_rand(0, 1) ? $nextImage() : "";
    };

    $paragraphs = $this->faker->randomElements([
      $this->generateParagraph(),
      $this->generateParagraph(),
      $this->generateParagraph(),
      $this->generateParagraph(),
      $this->generateParagraph(),
      $this->generateParagraph(),
    ], $this->faker->numberBetween(3, 6));

    $intro = "# " . $title . "\n\n";
    $intro .= $this->faker->paragraph(3) . "\n\n";
    $intro .= $this->faker->paragraph(4) . "\n\n";

    $body = "";

    // Sección 1
    $body .= "## " . $this->faker->randomElement([
      "Introducción", "Contexto", "¿Qué es esto?",
      "Primeros pasos", "Antes de empezar", "Fundamentos",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(4) . "\n\n";
    $body .= $this->faker->paragraph(3) . "\n\n";
    $body .= $this->generateCodeBlock() . "\n\n";
    $body .= $this->faker->paragraph(3) . "\n\n";

    $body .= $maybeImage();

    // Sección 2
    $body .= "## " . $this->faker->randomElement([
      "Instalación y configuración", "Puesta en marcha",
      "Conceptos clave", "Arquitectura", "Implementación",
      "Estructura del proyecto",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(4) . "\n\n";
    $body .= $this->generateList() . "\n\n";

    $body .= $maybeImage();

    // Subsección
    $body .= "### " . $this->faker->randomElement([
      "Pasos detallados", "Ejemplo práctico", "Caso de uso",
      "Consideraciones importantes", "Mejores prácticas",
      "Errores frecuentes",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(3) . "\n\n";
    $body .= $this->generateBlockquote() . "\n\n";
    $body .= $this->generateCodeBlock() . "\n\n";

    $body .= $maybeImage();

    // Sección 3
    $body .= "## " . $this->faker->randomElement([
      "Optimización y buenas prácticas", "Consejos avanzados",
      "Comparativa de enfoques", "Solución de problemas",
      "Alternativas disponibles", "Próximos pasos",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(4) . "\n\n";
    $body .= $this->generateList() . "\n\n";
    $body .= $this->faker->paragraph(3) . "\n\n";

    $body .= $maybeImage();

    // Sección inline code y links
    $body .= "### " . $this->faker->randomElement([
      "Detalles técnicos", "Referencias", "Recursos útiles",
      "Lecturas recomendadas", "Documentación oficial",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(3) . " ";
    $body .= "Puedes consultar la documentación oficial en ";
    $body .= $this->generateLink() . " para más información.\n\n";
    $body .= "Recuerda ejecutar `" . $this->faker->randomElement([
      "composer install", "npm run build", "php artisan migrate",
      "docker-compose up -d", "git push origin main",
      "pnpm run dev", "php artisan serve",
    ]) . "` para continuar.\n\n";

    // Conclusión
    $body .= "## " . $this->faker->randomElement([
      "Conclusión", "Resumen final", "Para cerrar",
      "¿Qué sigue?", "Reflexiones finales",
    ]) . "\n\n";
    $body .= $this->faker->paragraph(4) . "\n\n";
    $body .= $this->generateBlockquote() . "\n\n";
    $body .= "---\n\n";

    // Insert remaining images before extra paragraphs
    while ($imageIndex < $totalImages) {
      $body .= $nextImage();
    }

    $body .= $this->faker->paragraph(2) . "\n\n";

    // Párrafos adicionales
    foreach ($paragraphs as $paragraph) {
      $body .= $paragraph . "\n\n";
    }

    return $intro . $body;
  }

  private function generateParagraph(): string
  {
    $templates = [
      "> " . $this->faker->sentence() . "\n\n",
      "Para más información, visita " . $this->generateLink() . ".\n\n",
      "Un ejemplo de `" . $this->faker->word() . "` sería: " . $this->faker->sentence() . "\n\n",
      $this->faker->paragraph(3) . "\n\n",
      "Es importante recordar que **" . $this->faker->sentence() . "** " . $this->faker->sentence(4) . "\n\n",
      "> **Consejo:** " . $this->faker->sentence(6) . "\n\n",
    ];

    return $this->faker->randomElement($templates);
  }

  private function generateCodeBlock(): string
  {
    $lang = $this->faker->randomElement(["php", "javascript", "typescript", "bash", "python", "json", "yaml", "sql", "dockerfile", "vue"]);

    $snippets = [
      "php" => '<?php

namespace App\\Services;

class ExampleService
{
    public function handle(array $data): array
    {
        $result = collect($data)
            ->filter(fn ($item) => $item["active"])
            ->map(fn ($item) => [
                "id" => $item["id"],
                "name" => strtoupper($item["name"]),
                "created_at" => now()->format("Y-m-d"),
            ])
            ->values()
            ->toArray();

        Log::info("Procesados " . count($result) . " elementos");

        return $result;
    }
}',
      "javascript" => 'const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};',
      "typescript" => 'interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date;
}

function formatUser(user: User): string {
  const roles = user.roles.join(", ");
  return `${user.name} (${user.email}) - Roles: ${roles}`;
}

const users: User[] = await api.getUsers();
users.forEach((user) => console.log(formatUser(user)));',
      "bash" => '#!/bin/bash

# Deploy script
set -euo pipefail

APP_DIR="/var/www/app"
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"

echo "Iniciando despliegue..."

cd $APP_DIR

# Backup
echo "Creando backup..."
cp -r $APP_DIR $BACKUP_DIR

# Pull changes
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# Run migrations
php artisan migrate --force

# Clear cache
php artisan optimize

echo "Despliegue completado con éxito"',
      "python" => 'from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Task:
    title: str
    completed: bool = False
    priority: int = 0


class TaskManager:
    def __init__(self):
        self._tasks: List[Task] = []

    def add_task(self, title: str, priority: int = 0) -> Task:
        task = Task(title=title, priority=priority)
        self._tasks.append(task)
        return task

    def complete_task(self, index: int) -> Optional[Task]:
        if 0 <= index < len(self._tasks):
            self._tasks[index].completed = True
            return self._tasks[index]
        return None

    def pending_tasks(self) -> List[Task]:
        return [t for t in self._tasks if not t.completed]',
      "json" => '{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "Descripción del proyecto",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "vue-router": "^4.2.0"
  }
}',
      "sql" => '-- Obtener posts con su portada
SELECT
    p.id,
    p.title,
    p.status,
    i.path as cover_path,
    COUNT(pi.id) as image_count
FROM posts p
LEFT JOIN images i ON p.cover_id = i.id
LEFT JOIN post_images pi ON pi.post_id = p.id
WHERE p.status = "active"
    AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY p.id, p.title, p.status, i.path
ORDER BY p.created_at DESC
LIMIT 20;',
      "yaml" => 'services:
  app:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./src:/var/www/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php
    networks:
      - app-network

  php:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./src:/var/www/html
    environment:
      DB_HOST: database
      DB_DATABASE: app
      DB_USERNAME: app
      DB_PASSWORD: "${DB_PASSWORD}"
    networks:
      - app-network',
      "dockerfile" => 'FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    git \
    && docker-php-ext-install pdo_pgsql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

COPY . .

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]',
      "vue" => '<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import TaskItem from "@/components/TaskItem.vue";

const store = useTaskStore();
const newTask = ref("");
const filter = ref<"all" | "active" | "completed">("all");

const filteredTasks = computed(() => {
  switch (filter.value) {
    case "active":
      return store.activeTasks;
    case "completed":
      return store.completedTasks;
    default:
      return store.tasks;
  }
});

function addTask(): void {
  if (newTask.value.trim()) {
    store.addTask({ title: newTask.value.trim() });
    newTask.value = "";
  }
}
</script>

<template>
  <div class="task-manager">
    <input v-model="newTask" @keyup.enter="addTask" />
    <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" />
  </div>
</template>',
    ];

    $code = $this->faker->randomElement($snippets);

    return "```" . $lang . "\n" . $code . "\n```";
  }

  private function generateList(): string
  {
    $items = $this->faker->randomElements(
      [
        "Planificar la arquitectura antes de escribir código",
        "Escribir tests unitarios para cada funcionalidad",
        "Usar control de versiones desde el día uno",
        "Documentar las decisiones técnicas importantes",
        "Realizar code reviews antes de mergear",
        "Mantener las dependencias actualizadas",
        "Configurar CI/CD desde el inicio del proyecto",
        "Seguir los principios SOLID y patrones de diseño",
        "Optimizar consultas a la base de datos",
        "Implementar logging y monitoreo adecuados",
      ],
      $this->faker->numberBetween(3, 6),
    );

    return implode("\n", array_map(fn ($item) => "- " . $item, $items));
  }

  private function generateBlockquote(): string
  {
    $quotes = [
      "La simplicidad es la máxima sofisticación. — Leonardo da Vinci",
      "Cualquier tonto puede escribir código que un ordenador entienda. Los buenos programadores escriben código que los humanos puedan entender. — Martin Fowler",
      "Primero resuelve el problema, luego escribe el código. — John Johnson",
      "El código es como el humor. Cuando tienes que explicarlo, es malo. — Cory House",
      "La mejor manera de predecir el futuro es implementarlo. — Alan Kay",
      "No es que no podamos ver la solución, es que no podemos ver el problema. — G. K. Chesterton",
      "Hablar es barato, muéstrame el código. — Linus Torvalds",
    ];

    return "> " . $this->faker->randomElement($quotes);
  }

  private function generateLink(): string
  {
    $urls = [
      "https://laravel.com/docs",
      "https://vuejs.org/guide",
      "https://www.php.net/manual",
      "https://github.com/features/actions",
      "https://docs.docker.com",
      "https://www.typescriptlang.org/docs",
      "https://tailwindcss.com/docs",
      "https://nodejs.org/en/docs",
    ];

    $names = [
      "la documentación oficial", "este artículo",
      "la guía de referencia", "el repositorio en GitHub",
      "este recurso", "la documentación completa",
    ];

    $url = $this->faker->randomElement($urls);
    $name = $this->faker->randomElement($names);

    return "[" . $name . "](" . $url . ")";
  }
}
