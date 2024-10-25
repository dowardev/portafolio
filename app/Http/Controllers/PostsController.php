<?php

namespace App\Http\Controllers;

use App\Models\Images;
use App\Models\Post;
use App\Models\PostImage;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostsController extends Controller
{
  function getImagePost(Request $request)
  {
    if (Storage::disk("tmp")->get($request->name)) {
      return Storage::disk("tmp")->get($request->name);
    } else {
      return Storage::disk("images_posts")->get($request->name);
    }
  }

  public function getPosts(Request $request)
  {
    $date = (new DateTime($request->date))->format("Y-m-d");

    try {
      $result = DB::table("posts")
        ->join("images", "cover_id", "=", "images.id")
        ->select(
          "posts.id as post_id",
          "posts.title as post_title",
          "posts.content as post_content",
          "posts.created_at as post_created_at",
          "posts.updated_at as post_updated_at",
          "images.id as image_id",
          "images.name as image_name",
          "images.path as image_path"
        )
        ->whereDate("posts.created_at", $date)
        ->get();

      if ($result == null) {
        return response()->json(
          [
            "message" => "No posts",
          ],
          200
        );
      }
    } catch (Exception $e) {
      return response()->json(
        [
          "message" => $e->getMessage(),
        ],
        $e->getCode()
      );
    }

    $posts = [];
    foreach ($result as $key => $value) {
      $post = [
        "id" => $value->post_id,
        "title" => $value->post_title,
        "content" => $value->post_content,
        "created_at" => (new DateTime($value->post_created_at))->format(
          DateTime::ATOM
        ),
        "updated_at" => $value->post_updated_at,
        "cover" => [
          "id" => $value->image_id,
          "name" => $value->image_name,
          "path" => $value->image_path,
          "source" => base64_encode(
            Storage::disk("images_posts")->get($value->image_name)
          ),
        ],
      ];
      array_push($posts, $post);
    }
    return ["posts" => $posts];
  }

  public function getPostsDates()
  {
    try {
      $postDates = Post::select("created_at")
        ->orderBy("created_at", "desc")
        ->get();

      $dates = [];
      foreach ($postDates as $key => $value) {
        $date = $value->created_at;
        array_push($dates, explode("+", $date->format(DateTime::ATOM))[0]);
      }

      $dates = array_map(function ($date) {
        return date("Y-m-d", strtotime($date));
      }, $dates);

      $dates = array_unique($dates);

      return response()->json($dates, 200);
    } catch (Exception $e) {
      return response()->json(
        [
          "message" => $e->getMessage(),
        ],
        $e->getCode()
      );
    }
  }

  public function getPost(Request $request)
  {
    $post_id = $request->id;

    $result = DB::table("posts")
      ->join("images", "cover_id", "=", "images.id")
      ->select(
        "posts.id as post_id",
        "posts.title as post_title",
        "posts.content as post_content",
        "posts.created_at as post_created_at",
        "posts.updated_at as post_updated_at",
        "images.id as image_id",
        "images.name as image_name",
        "images.path as image_path"
      )
      ->where("posts.id", $post_id)
      ->get();

    $posts = [];
    foreach ($result as $key => $value) {
      $post = [
        "id" => $value->post_id,
        "title" => $value->post_title,
        "content" => $value->post_content,
        "created_at" => (new DateTime($value->post_created_at))->format(
          DateTime::ATOM
        ),
        "updated_at" => (new DateTime($value->post_updated_at))->format(
          DateTime::ATOM
        ),
        "cover" => [
          "id" => $value->image_id,
          "name" => $value->image_name,
          "path" => $value->image_path,
          "source" => base64_encode(
            Storage::disk("images_posts")->get($value->image_name)
          ),
        ],
      ];
      array_push($posts, $post);
    }
    return ["post" => $posts[0]];
  }

  public function createPost(Request $request)
  {
    $images = $request->images;

    if (Auth::guard("api")->user()->is_admin == false) {
      return response()->json(
        [
          "message" => "Unauthorized",
        ],
        200
      );
    }

    $title = $request->title;
    $content = $request->content;
    $cover_id = $request->coverId;
    if ($request->has("images") && is_array($request->input("images"))) {
      $images = $request->input("images");
    } else {
      $images = [];
    }

    $messages = [
      "title.required" => "The title field is required.",
      "content.required" => "The content field is required.",
      "cover_id.required" => "The cover_id field is required.",
    ];

    $validator = Validator::make(
      $request->all(),
      [
        "title" => "required",
        "content" => "required",
        "cover_id" => "required",
      ],
      $messages
    );

    $this->moveImage($cover_id);
    $post = Post::create([
      "title" => $title,
      "content" => $content,
      "cover_id" => $cover_id,
    ]);
    $post_id = $post->id;

    foreach ($images as $key => $value) {
      $this->moveImage($value);
      PostImage::create([
        "post_id" => $post_id,
        "image_id" => $value,
      ]);
    }
  }

  private function moveImage($id)
  {
    $image = Images::find($id);
    $imageName = $image->name;
    $image->path = "/images_posts/" . $imageName;
    $image->save();
    Storage::move("tmp/" . $imageName, "images_posts/" . $imageName);
  }

  public function searchPost(Request $request)
  {
    $search = $request->search;
    $query = Post::select("id", "title")
      ->where("title", "like", "%" . $search . "%")
      ->get();

    return response()->json(
      [
        "posts" => $query,
      ],
      200
    );
  }
}
