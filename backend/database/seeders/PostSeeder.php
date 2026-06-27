<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
  public function run(): void
  {
    // 70 posts activos
    Post::factory()->count(70)->create(["status" => "active"]);

    // 20 borradores
    Post::factory()->count(20)->create(["status" => "draft"]);

    // 10 inactivos
    Post::factory()->count(10)->create(["status" => "inactive"]);
  }
}
