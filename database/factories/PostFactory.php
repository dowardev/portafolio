<?php

namespace Database\Factories;

use App\Models\Images;
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
        $randomDate = date("d M Y", time());
        return [
            "title" => $this->faker->title(),
            "content" => Str::random(5000),
            "cover_id" => Images::factory()->create()->id,
            "created_at" => $randomDate,
        ];
    }
}
