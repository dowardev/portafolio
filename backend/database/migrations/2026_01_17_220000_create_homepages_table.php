<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intro_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->json('tags')->nullable();
            $table->text('description')->nullable();
            $table->json('socials')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('photo_url')->nullable();
            $table->json('stack')->nullable();
            $table->json('skill_categories')->nullable();
            $table->json('experience')->nullable();
            $table->json('projects')->nullable();
            $table->json('certificates')->nullable();
            $table->json('freelance')->nullable();
            $table->json('show_contact_form')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intro_profiles');
    }
};