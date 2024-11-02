<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
    // User::create([
    //   "name" => "Admin",
    //   "user" => "admin",
    //   "email" => "admin@admin.com",
    //   "image_id" => null,
    //   "is_email_verified" => true,
    //   "password" => bcrypt("123"),
    //   "is_admin" => true,
    // ]);
    // User::factory(10)->create();
    Post::factory(1)->create();
  }
}
