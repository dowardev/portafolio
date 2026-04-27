<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErrorReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Controllers\Admin\IntroProfileController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\FreelanceController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\StackController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Middleware\Cors;
use App\Http\Middleware\SSOTokenAuth;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

Route::middleware([Cors::class])->group(function () {
  Route::post("upload-image", [SystemController::class, "uploadImage"]);
  Route::post("contact", [SystemController::class, "createContactMessage"]);
  Route::post("feedback", [FeedbackController::class, "createFeedback"]);
  Route::get("get-image", [SystemController::class, "getImage"]);
  Route::get("serve-image", [SystemController::class, "serveImage"]);
  Route::options("serve-image", function () {
    return response("", 200, [
      "Access-Control-Allow-Origin" => "*",
      "Access-Control-Allow-Methods" => "GET, OPTIONS",
      "Access-Control-Allow-Headers" => "Content-Type",
    ]);
  });
  Route::get("get-intro", [IntroProfileController::class, "getIntro"]);
  Route::get("get-projects", [HomePageController::class, "getProjects"]);
  Route::get("get-experiences", [HomePageController::class, "getExperiences"]);
  Route::get("get-freelance", [HomePageController::class, "getFreelance"]);
  Route::get("get-skills", [HomePageController::class, "getSkills"]);
  Route::get("get-certificates", [HomePageController::class, "getCertificates"]);
  Route::post("error-report", [
    ErrorReportController::class,
    "createErrorReport",
  ]);

  // REST endpoints for separate tables
  Route::get("experiences", [ExperienceController::class, "index"]);
  Route::get("projects", [ProjectController::class, "index"]);
  Route::get("certificates", [CertificateController::class, "index"]);
  Route::get("freelances", [FreelanceController::class, "index"]);
  Route::get("stacks", [StackController::class, "index"]);
  Route::get("skills", [SkillController::class, "index"]);
  Route::get("categories", [CategoryController::class, "index"]);

  Route::get("posts/{date}/{filter}", [PostsController::class, "getPosts"]);
  Route::get("post-dates", [PostsController::class, "getPostsDates"]);
  Route::get("post/{id}", [PostsController::class, "getPost"]);
  Route::get("search-posts/{search}", [PostsController::class, "searchPost"]);
  Route::post("create-post", [PostsController::class, "createPost"]);
  Route::post("update-post", [PostsController::class, "updatePost"]);
  Route::post("delete-post", [PostsController::class, "deletePost"]);
});

Route::middleware([Cors::class, 'sso.auth'])->group(function () {
  Route::get("user-auth", [AuthController::class, "user"]);
  Route::post("new-post", [PostsController::class, "createPost"]);
});

Route::middleware([Cors::class, 'sso.auth', 'admin.only'])->prefix('admin')->group(function () {
  // Intro Profile
  Route::post("update-intro", [IntroProfileController::class, "updateIntro"]);

  // Skills - Ahora en tabla separada (se creará endpoint)
  // Las rutas de skills se moverán a SkillController

  // Projects - REST API
  Route::post("projects", [ProjectController::class, "store"]);
  Route::post("projects/{id}", [ProjectController::class, "update"]);
  Route::delete("projects/{id}", [ProjectController::class, "destroy"]);

  // Experience - REST API
  Route::post("experiences", [ExperienceController::class, "store"]);
  Route::post("experiences/{id}", [ExperienceController::class, "update"]);
  Route::delete("experiences/{id}", [ExperienceController::class, "destroy"]);

  // Freelance - REST API
  Route::post("freelances", [FreelanceController::class, "store"]);
  Route::post("freelances/{id}", [FreelanceController::class, "update"]);
  Route::delete("freelances/{id}", [FreelanceController::class, "destroy"]);

  // Skills - REST API (tabla separada)
  Route::post("skills", [SkillController::class, "store"]);
  Route::post("skills/{id}", [SkillController::class, "update"]);
  Route::delete("skills/{id}", [SkillController::class, "destroy"]);

  // Certificates - REST API
  Route::post("certificates", [CertificateController::class, "store"]);
  Route::post("certificates/{id}", [CertificateController::class, "update"]);
  Route::delete("certificates/{id}", [CertificateController::class, "destroy"]);

  // Stack - REST API
  Route::post("stacks", [StackController::class, "store"]);
  Route::post("stacks/{id}", [StackController::class, "update"]);
  Route::delete("stacks/{id}", [StackController::class, "destroy"]);

  // Categories - REST API
  Route::post("categories", [CategoryController::class, "store"]);
  Route::post("categories/{id}", [CategoryController::class, "update"]);
  Route::delete("categories/{id}", [CategoryController::class, "destroy"]);
});
