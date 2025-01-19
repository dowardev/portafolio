<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(Cors::class)->group(function () {
  // auth
  Route::post("login", [AuthController::class, "login"]);
  Route::post("signup", [AuthController::class, "signup"]);
  Route::post("recover-password", [AuthController::class, "recoverPassword"]);
  Route::post("reset-password", [AuthController::class, "resetPassword"]);

  // others
  Route::post("upload-image", [SystemController::class, "uploadImage"]);
  Route::post("contact", [SystemController::class, "createContactMessage"]);
  Route::post("feedback", [SystemController::class, "createFeedback"]);
  Route::get("get-image", [SystemController::class, "getImage"]);

  // posts
  Route::get("posts/{date}/{filter}", [PostsController::class, "getPosts"]);
  Route::get("post-dates", [PostsController::class, "getPostsDates"]);
  Route::get("post/{id}", [PostsController::class, "getPost"]);
  Route::get("search-posts/{search}", [PostsController::class, "searchPost"]);
  Route::post("create-post", [PostsController::class, "createPost"]);
  Route::post("update-post", [PostsController::class, "updatePost"]);
  Route::post("delete-post", [PostsController::class, "deletePost"]);
});

Route::group(["middleware" => "auth:api"], function () {
  // user
  Route::get("user-auth", [AuthController::class, "user"]);

  // posts
  Route::post("new-post", [PostsController::class, "createPost"]);

  // admin users
  Route::get("users", [UserController::class, "getUsers"]);
  Route::post("update-user-status", [
    UserController::class,
    "updateUserStatus",
  ]);
  Route::post("admin/delete-user", [UserController::class, "adminDeleteUser"]);
});
