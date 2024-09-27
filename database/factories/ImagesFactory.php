<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Imges>
 */
class ImagesFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $file = $this->faker->image(
      storage_path("app/images_posts"),
      640,
      480,
      null,
      false
    );
    new UploadedFile(
      storage_path("app/images_posts/") . $file,
      $file,
      "image/jpeg",
      null,
      true
    );

    return [
      "name" => $file,
      "path" => "/images_posts/" . $file,
    ];
  }
}
