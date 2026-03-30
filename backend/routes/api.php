<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErrorReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Middleware\Cors;
use Illuminate\Support\Facades\Route;

Route::middleware([Cors::class, 'sso.auth'])->group(function () {
  Route::get("user-auth", [AuthController::class, "user"]);

  Route::post("new-post", [PostsController::class, "createPost"]);

  Route::get("admin/get-homepage-info", [HomePageController::class, "show"]);
  Route::post("admin/update-homepage-info", [HomePageController::class, "update"]);
});

Route::middleware([Cors::class])->group(function () {
  Route::post("upload-image", [SystemController::class, "uploadImage"]);
  Route::post("contact", [SystemController::class, "createContactMessage"]);
  Route::post("feedback", [FeedbackController::class, "createFeedback"]);
  Route::get("get-image", [SystemController::class, "getImage"]);
  Route::get("get-homepage-info", [HomePageController::class, "show"]);
  Route::post("error-report", [
    ErrorReportController::class,
    "createErrorReport",
  ]);

  Route::get("posts/{date}/{filter}", [PostsController::class, "getPosts"]);
  Route::get("post-dates", [PostsController::class, "getPostsDates"]);
  Route::get("post/{id}", [PostsController::class, "getPost"]);
  Route::get("search-posts/{search}", [PostsController::class, "searchPost"]);
  Route::post("create-post", [PostsController::class, "createPost"]);
  Route::post("update-post", [PostsController::class, "updatePost"]);
  Route::post("delete-post", [PostsController::class, "deletePost"]);
});
