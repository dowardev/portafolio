<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    function createPost(Request $request)
    {
        Post::create([
            "title" => $request->title,
            "content" => $request->content,
        ]);
        return response()->json("Success", 200);
    }
    function getPosts()
    {
        return response()->json(Post::get(), 200);
    }
    function getPost(Request $request)
    {
        $post = Post::find($request->id);
        return response()->json($post, 200);
    }
}
