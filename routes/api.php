<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// use App\Http\Controllers\SystemController;
use App\Http\Controllers\PostsController;
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

route::middleware('auth:sanctum')->get('/user', function (request $request) {
  return $request->user();
});

// Route::get('get-image-tmp/', [SystemController::class, 'getTmpImage']);
Route::get('get-image-posts/', [PostsController::class, 'getImagePost']);

Route::group(['prefix' => 'auth'], function () {
  Route::post('mail-reset-password', [
    AuthController::class,
    'sendCodeResetPassword',
  ]);

  Route::post('code-reset-password', [
    AuthController::class,
    'verifyCodeResetPassword',
  ]);

  Route::post('reset-password', [AuthController::class, 'resetPassword']);
  //
  //     Route::group(['middleware' => 'auth:api'], function () {
  //         Route::get('logout', [AuthController::class, 'logout']);
  //         Route::get('user', [AuthController::class, 'user']);
  //
  //         // posts
  //         Route::post('create-post', [PostController::class, 'createPost']);
  //         Route::post('upload-image-post', [
  //             PostController::class,
  //             'uploadImagePost',
  //         ]);
  //     });
});
