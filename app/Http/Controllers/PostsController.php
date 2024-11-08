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
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Validator;

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
    $filter = $request->filter;

    try {
      $query = DB::table("posts")
        ->join("images", "cover_id", "=", "images.id")
        ->select(
          "posts.id as post_id",
          "posts.title as post_title",
          "posts.content as post_content",
          "posts.created_at as post_created_at",
          "posts.updated_at as post_updated_at",
          "posts.status as post_status",
          "images.id as image_id",
          "images.name as image_name",
          "images.path as image_path"
        )
        ->whereDate("posts.created_at", $date);

      if ($filter !== "all") {
        $query->where("posts.status", $filter);
      }

      $result = $query->get();

      if ($result->isEmpty()) {
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
    $systemController = new SystemController();
    foreach ($result as $value) {
      $imageRequest = new Request(["name" => $value->image_name]);
      $imageResponse = $systemController->getImage($imageRequest);
      $imageData = json_decode($imageResponse->getContent(), true);

      $post = [
        "id" => $value->post_id,
        "title" => $value->post_title,
        "content" => $value->post_content,
        "created_at" => (new DateTime($value->post_created_at))->format(
          DateTime::ATOM
        ),
        "updated_at" => $value->post_updated_at,
        "status" => $value->post_status,
        "cover" => [
          "id" => $value->image_id,
          "name" => $value->image_name,
          "url" => $imageData["url"],
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
      $dates = array_values($dates);

      // Convertir el array a un objeto con índices numéricos
      $datesObject = (object) $dates;

      return response()->json($datesObject, 200);
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
          "url" => "",
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

    Images::where("id", $cover_id)->update(["status" => true]);

    $post = Post::create([
      "title" => $title,
      "content" => $content,
      "cover_id" => $cover_id,
    ]);
    $post_id = $post->id;

    foreach ($images as $key => $value) {
      PostImage::create([
        "post_id" => $post_id,
        "image_id" => $value,
      ]);
      Images::where("id", $value)->update(["status" => true]);
    }
  }

  private function moveImage($id)
  {
    $image = Images::find($id);
    $old_disk = "tmp";
    $new_disk = "posts_images";
    $imageName = $image->name;
    Storage::disk($new_disk)->put(
      $imageName,
      Storage::disk($old_disk)->get($imageName)
    );
    Storage::disk($old_disk)->delete($imageName);
    $image->path = $new_disk;
    $image->save();
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

  public function updatePost(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "id" => "required|integer",
      "title" => "required|string",
      "content" => "required|string",
      "coverId" => "required|integer",
      "newCoverId" => "integer|nullable",
      "images" => "array|nullable",
      "imagesRemoved" => "array|nullable",
    ]);

    if ($validator->fails()) {
      return response()->json(["errors" => $validator->errors()], 400);
    }

    $id = intval($request->id);
    $title = $request->title;
    $content = $request->content;
    $cover_id = intval($request->coverId);

    $new_cover_id = $request->has("newCoverId") ? $request->newCoverId : "";

    $new_images = $request->has("images") ? $request->images : [];

    $images_removed = $request->has("imagesRemoved")
      ? $request->imagesRemoved
      : [];

    Post::where("id", "=", $id)->update([
      "title" => $title,
      "content" => $content,
    ]);

    if (!empty($new_cover_id)) {
      $cover_name = Images::where("id", "=", $cover_id)->first()->name;
      Post::where("id", "=", $id)->update([
        "cover_id" => $new_cover_id,
      ]);
      Storage::delete("images_posts/" . $cover_name);
      Images::where("id", "=", $cover_id)->delete();
      $this->moveImage($new_cover_id);
    }

    foreach ($images_removed as $value) {
      Storage::delete("images_posts/" . $value);
      Images::where("name", "=", $value)->delete();
    }

    foreach ($new_images as $value) {
      $this->moveImage($value);
      PostImage::create([
        "image_id" => $value,
        "post_id" => $id,
      ]);
    }

    return response()->json(["message" => "Post updated successfully"], 200);
  }

  public function deletePost(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "id" => "required|integer",
    ]);

    if ($validator->fails()) {
      return response()->json(["errors" => $validator->errors()], 400);
    }

    $id = $request->id;

    $post_images = Post::find($id)->images;
    foreach ($post_images as $key => $value) {
      $image_name = Images::find($value->image_id)->name;
      Images::where("id", $value->image_id)->delete();
      Storage::delete("images_posts/" . $image_name);
    }

    $cover_id = Post::find($id)->cover_id;
    $image_name = Images::find($cover_id)->name;
    Storage::delete("images_posts/" . $image_name);
    Images::where("id", $cover_id)->delete();

    Post::where("id", $id)->delete();

    return response()->json(["message" => "Post deleted successfully"], 200);
  }
}
