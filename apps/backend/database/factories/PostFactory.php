<?php

namespace Database\Factories;

use App\Models\Image;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $timestamp = mt_rand(1, time());
    $randomDate = date("Y-m-d H:i:s", $timestamp);
    return [
      "title" => $this->faker->title(),
      "content" => Str::random(5000),
      "cover_id" => Image::factory()->disk("posts_images")->create()->id,
      "created_at" => $randomDate,
      "status" => "active",
    ];
  }
}
