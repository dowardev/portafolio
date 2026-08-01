<?php

use App\Models\Post;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('slug', 255)->nullable()->after('title');
        });

        $slugs = [];
        foreach (Post::all() as $post) {
            $baseSlug = Str::slug($post->title);
            $slug = $baseSlug;
            $counter = 1;

            while (in_array($slug, $slugs)) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            $slugs[] = $slug;
            $post->slug = $slug;
            $post->saveQuietly();
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->string('slug', 255)->nullable(false)->change();
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
