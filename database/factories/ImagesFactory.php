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
        $url =
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.PWjQEPtis0ENv4JISih0eQHaF7%26pid%3DApi&f=1";
        $name = $this->faker->colorName();
        $contents = file_get_contents($url);
        $file = storage_path("app/images_posts/") . $name;
        file_put_contents($file, $contents);
        new UploadedFile($file, $name);

        return [
            "name" => $name,
            "path" => "/images_posts",
        ];
    }
}
