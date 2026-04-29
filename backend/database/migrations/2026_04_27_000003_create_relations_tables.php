<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url')->nullable()->after('name');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('socials', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('url');
            $table->string('icon_name');
            $table->timestamps();
        });

        Schema::create('technologies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('image')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('intro_profile_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intro_profile_id')->constrained('intro_profiles')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('intro_profile_socials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intro_profile_id')->constrained('intro_profiles')->onDelete('cascade');
            $table->foreignId('social_id')->constrained('socials')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('project_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('experience_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experience_id')->constrained('experiences')->onDelete('cascade');
            $table->foreignId('technology_id')->constrained('technologies')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience_technologies');
        Schema::dropIfExists('project_technologies');
        Schema::dropIfExists('intro_profile_socials');
        Schema::dropIfExists('intro_profile_tags');
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('socials');
        Schema::dropIfExists('tags');
    }
};