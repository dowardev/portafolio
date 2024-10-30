<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(Cors::class)->group(function () {
  // auth
  Route::post("login", [AuthController::class, "login"]);
  Route::post("signup", [AuthController::class, "signup"]);

  // others
  Route::post("upload-image", [SystemController::class, "uploadImage"]);
  Route::post("contact", [SystemController::class, "createContactMessage"]);
  Route::post("feedback", [SystemController::class, "createFeedback"]);

  Route::post("recover-password", [AuthController::class, "recoverPassword"]);
  Route::post("reset-password", [AuthController::class, "resetPassword"]);
});

Route::group(["middleware" => "auth:api"], function () {
  // user
  Route::get("user-auth", [AuthController::class, "user"]);

  // posts
  Route::get("posts/{date}", [PostsController::class, "getPosts"]);
  Route::get("post-dates", [PostsController::class, "getPostsDates"]);
  Route::get("post/{id}", [PostsController::class, "getPost"]);
  Route::post("new-post", [PostsController::class, "createPost"]);
  Route::get("search-posts/{search}", [PostsController::class, "searchPost"]);

  // admin users
  Route::get("search-user/{perpage}", [AuthController::class, "searchUser"]);
});
