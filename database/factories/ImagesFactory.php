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
   * The storage disk to use.
   *
   * @var string
   */
  protected $disk = "default_disk";

  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $image = UploadedFile::fake()->image("image.jpg", 640, 480);
    $path = Storage::disk($this->disk)->putFile("", $image);

    return [
      "name" => $path,
      "path" => $this->disk,
    ];
  }

  /**
   * Set the storage disk.
   *
   * @param string $disk
   * @return \Illuminate\Database\Eloquent\Factories\Factory
   */
  public function disk(string $disk)
  {
    $this->disk = $disk;
    return $this;
  }
}
