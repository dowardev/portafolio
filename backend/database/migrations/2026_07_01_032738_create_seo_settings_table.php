<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_title', 255)->nullable();
            $table->string('site_description', 500)->nullable();
            $table->string('site_image_path', 500)->nullable();
            $table->string('site_keywords', 500)->nullable();
            $table->string('lang_code', 10)->default('es');
            $table->string('og_site_name', 255)->nullable();
            $table->string('twitter_handle', 255)->nullable();
            $table->boolean('robots_index')->default(true);
            $table->string('canonical_base', 255)->nullable();
            $table->string('admin_api_url', 255)->nullable();
            $table->timestamps();
        });

        DB::table('seo_settings')->insert([
            'id' => 1,
            'site_title' => 'Dowar Blog',
            'site_description' => 'Blog personal de tecnología y desarrollo',
            'site_keywords' => 'blog, tecnología, desarrollo, programación',
            'lang_code' => 'es',
            'robots_index' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};