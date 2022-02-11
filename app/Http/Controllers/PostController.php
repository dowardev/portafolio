<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Images;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    function createPost(Request $request)
    {
        Post::create([
            "title" => $request->title,
            "content" => $request->content,
            "cover_id" => $request->coverId,
        ]);
        return response()->json("Success", 200);
    }
    function getPosts()
    {
        $posts = Post::get();
        foreach ($posts as $key => $value) {
            $value->cover = Images::find($value->cover_id)->name;
        }
        return response()->json($posts, 200);
    }
    function getPost(Request $request)
    {
        $post = Post::find($request->id);
        $post->cover = Images::find($post->cover_id)->name;
        return response()->json($post, 200);
    }
    function uploadImagePost(Request $request)
    {
        $file = $request->file("image");
        $filename = uniqid() . time() . ".webp";
        $path = $file->storeAs("images_posts", $filename);

        $image = Images::create([
            "name" => $filename,
            "path" => $path,
        ]);
        return response()->json(
            ["id" => $image->id, "name" => $filename, "path" => $path],
            200
        );
    }
    function getImagePost(Request $request)
    {
        return Storage::disk("images_posts")->get($request->name);
    }
}
