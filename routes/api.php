<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware("auth:sanctum")->get("/user", function (Request $request) {
    return $request->user();
});
Route::get("get-image/", [PostController::class, "getImagePost"]);

Route::group(["prefix" => "auth"], function () {
    Route::post("login", [AuthController::class, "login"]);
    // TODO: disable
    Route::post("signup", [AuthController::class, "signup"]);

    Route::group(["middleware" => "auth:api"], function () {
        Route::get("logout", [AuthController::class, "logout"]);
        Route::get("user", [AuthController::class, "user"]);

        // posts
        Route::post("create-post", [PostController::class, "createPost"]);
        Route::get("get-posts", [PostController::class, "getPosts"]);
        Route::get("get-post", [PostController::class, "getPost"]);
        Route::post("upload-image-post", [
            PostController::class,
            "uploadImagePost",
        ]);

        Route::get("get-image-post", [PostController::class, "getImagePost"]);
    });
});
