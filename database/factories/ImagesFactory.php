<?php

namespace Database\Factories;

use App\Models\Images;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Images>
 */
class ImagesFactory extends Factory
{
  protected $model = Images::class;

  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $image = UploadedFile::fake()->image("image.jpg", 640, 480);
    $path = Storage::disk("images_posts")->putFile($image);

    return [
      "name" => $this->faker->word,
      "path" => $path,
    ];
  }
}
