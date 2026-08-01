<?php

namespace Database\Factories;

use App\Models\Image;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends Factory<Image>
 */
class ImageFactory extends Factory
{
    protected $model = Image::class;

    protected $disk = 'default_disk';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $name = 'image_'.uniqid().'.jpg';

        $poolDir = resource_path('images-pool');
        $poolFiles = glob($poolDir.'/*.{jpg,jpeg,png}', GLOB_BRACE);

        if (! empty($poolFiles)) {
            $src = $poolFiles[array_rand($poolFiles)];
            Storage::disk($this->disk)->put($name, file_get_contents($src));
        } else {
            $width = 320;
            $height = 240;
            Storage::disk($this->disk)->put($name, $this->generatePng($width, $height));
        }

        return [
            'name' => $name,
            'path' => $this->disk,
        ];
    }

    /**
     * Generate a valid PNG image without GD library.
     */
    private function generatePng(int $width, int $height): string
    {
        $r = mt_rand(50, 200);
        $g = mt_rand(50, 200);
        $b = mt_rand(50, 200);

        // Build raw pixel data with filter byte per row
        $rawData = '';
        for ($y = 0; $y < $height; $y++) {
            // Filter byte: 0 (None)
            $rawData .= "\x00";
            for ($x = 0; $x < $width; $x++) {
                // Add some variation for a gradient effect
                $vr = min(255, max(0, $r + ($x * 10 / $width) + ($y * 10 / $height)));
                $vg = min(255, max(0, $g + ($y * 20 / $height)));
                $vb = min(255, max(0, $b + ($x * 15 / $width)));
                $rawData .= pack('CCC', (int) $vr, (int) $vg, (int) $vb);
            }
        }

        // PNG signature
        $png = "\x89PNG\r\n\x1a\n";

        // IHDR chunk
        $ihdr = pack('NN', $width, $height)."\x08\x02\x00\x00\x00";
        $png .= $this->pngChunk('IHDR', $ihdr);

        // IDAT chunk (compressed with zlib)
        $compressed = gzcompress($rawData, 9);
        $png .= $this->pngChunk('IDAT', $compressed);

        // IEND chunk
        $png .= $this->pngChunk('IEND', '');

        return $png;
    }

    private function pngChunk(string $type, string $data): string
    {
        $length = pack('N', strlen($data));
        $crc = crc32($type.$data);

        return $length.$type.$data.pack('N', $crc);
    }

    /**
     * Set the storage disk.
     *
     * @return Factory
     */
    public function disk(string $disk)
    {
        $this->disk = $disk;

        return $this;
    }
}
