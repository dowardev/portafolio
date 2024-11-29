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
use Illuminate\Support\Facades\URL;

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

    $requestedFields = $request->input("data.fields", ["all"]);

    $allowedFields = [
      "id",
      "title",
      "content",
      "created_at",
      "updated_at",
      "status",
      "cover",
    ];

    try {
      if (in_array("all", $requestedFields) || empty($requestedFields)) {
        $requestedFields = $allowedFields;
      } else {
        $validFields = array_intersect($requestedFields, $allowedFields);

        if (empty($validFields)) {
          return response()->json(
            [
              "message" => "No valid fields requested",
            ],
            400
          );
        }

        $requestedFields = $validFields;
      }

      $query = Post::with("cover")->whereDate("created_at", $date);

      if ($filter !== "all") {
        $query->where("status", $filter);
      }

      $posts = $query->get();

      if ($posts->isEmpty()) {
        return response()->json(
          [
            "message" => "No posts",
          ],
          200
        );
      }

      $result = [];
      foreach ($posts as $post) {
        $postData = [];

        foreach ($requestedFields as $field) {
          if ($field === "cover") {
            if ($post->cover) {
              $postData["cover"] = [
                "id" => $post->cover->id,
                "name" => $post->cover->name,
                "url" => URL::to(
                  Storage::url($post->cover->path . "/" . $post->cover->name)
                ),
              ];
            } else {
              $postData["cover"] = null;
            }
          } else {
            $postData[$field] = $post->$field;
          }
        }

        $result[] = $postData;
      }

      return response()->json(
        ["posts" => $result],
        200,
        [],
        JSON_UNESCAPED_SLASHES
      );
    } catch (Exception $e) {
      return response()->json(
        [
          "message" => $e->getMessage(),
        ],
        $e->getCode() ?: 500
      );
    }
  }

  public function getPostsDates(Request $request)
  {
    $status = $request->has("status") ? $request->status : "active";

    try {
      $postDatesQuery = Post::select("created_at")->orderBy(
        "created_at",
        "desc"
      );

      if ($status !== "all") {
        $postDatesQuery->where("status", $status);
      }

      $postDates = $postDatesQuery->get();

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
    $requestedFields = $request->input("data.fields", ["all"]);

    $allowedFields = [
      "id",
      "title",
      "content",
      "created_at",
      "updated_at",
      "status",
      "cover",
    ];

    try {
      if (in_array("all", $requestedFields) || empty($requestedFields)) {
        $requestedFields = $allowedFields;
      } else {
        $validFields = array_intersect($requestedFields, $allowedFields);

        if (empty($validFields)) {
          return response()->json(
            [
              "message" => "No valid fields requested",
            ],
            400
          );
        }

        $requestedFields = $validFields;
      }

      $post = Post::with("cover")->find($post_id);

      if (!$post) {
        return response()->json(
          [
            "message" => "Post not found",
          ],
          404
        );
      }

      $postData = [];

      foreach ($requestedFields as $field) {
        if ($field === "cover") {
          if ($post->cover) {
            $disk = Storage::disk($post->cover->path);
            $postData["cover"] = [
              "id" => $post->cover->id,
              "name" => $post->cover->name,
              "url" => URL::to(
                Storage::url($post->cover->path . "/" . $post->cover->name)
              ),
            ];
          } else {
            $postData["cover"] = null;
          }
        } else {
          $postData[$field] = $post->$field;
        }
      }

      return response()->json(
        ["post" => $postData],
        200,
        [],
        JSON_UNESCAPED_SLASHES
      );
    } catch (Exception $e) {
      return response()->json(
        [
          "message" => $e->getMessage(),
        ],
        $e->getCode() ?: 500
      );
    }
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
      Storage::disk("posts_images")->delete($cover_name);
      Images::where("id", "=", $cover_id)->delete();
    }

    foreach ($images_removed as $value) {
      Storage::disk("posts_images")->delete($value);
      Images::where("name", "=", $value)->delete();
    }

    foreach ($new_images as $value) {
      // $this->moveImage($value);
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
