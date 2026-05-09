<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErrorReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\Admin\IntroProfileController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\FreelancePlatformController;
use App\Http\Controllers\Admin\FreelanceCommentController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\StackController;
use App\Http\Controllers\Admin\SkillsCategoryController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Middleware\Cors;
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
  Route::post("error-report", [
    ErrorReportController::class,
    "createErrorReport",
  ]);

  // REST endpoints for separate tables
  Route::get("experiences", [ExperienceController::class, "index"]);
  Route::get("projects", [ProjectController::class, "index"]);
  Route::get("certificates", [CertificateController::class, "index"]);
  Route::get("freelance-platforms", [FreelancePlatformController::class, "index"]);
  Route::get("freelance-comments", [FreelanceCommentController::class, "index"]);
  Route::get("stacks", [StackController::class, "index"]);
  Route::get("skills-categories", [SkillsCategoryController::class, "index"]);

  Route::get("posts/{date}/{filter}", [PostsController::class, "getPosts"]);
  Route::get("post-dates", [PostsController::class, "getPostsDates"]);
  Route::get("post/{id}", [PostsController::class, "getPost"]);
  Route::get("search-posts/{search}", [PostsController::class, "searchPost"]);
  Route::post("create-post", [PostsController::class, "createPost"]);
  Route::post("update-post", [PostsController::class, "updatePost"]);
  Route::post("delete-post", [PostsController::class, "deletePost"]);
});

Route::middleware([Cors::class, 'sso.auth'])->group(function () {
  Route::post("new-post", [PostsController::class, "createPost"]);
});

Route::middleware([Cors::class, 'sso.auth', 'sso.role:admin'])->prefix('admin')->group(function () {
  // Intro Profile
  Route::post("update-intro", [IntroProfileController::class, "updateIntro"]);

  // Projects - REST API
  Route::post("projects", [ProjectController::class, "store"]);
  Route::post("projects/{id}", [ProjectController::class, "update"]);
  Route::delete("projects/{id}", [ProjectController::class, "destroy"]);

  // Experience - REST API
  Route::post("experiences", [ExperienceController::class, "store"]);
  Route::post("experiences/{id}", [ExperienceController::class, "update"]);
  Route::delete("experiences/{id}", [ExperienceController::class, "destroy"]);

  // Freelance Platforms - REST API
  Route::post("freelance-platforms", [FreelancePlatformController::class, "store"]);
  Route::post("freelance-platforms/{id}", [FreelancePlatformController::class, "update"]);
  Route::delete("freelance-platforms/{id}", [FreelancePlatformController::class, "destroy"]);

  // Freelance Comments - REST API
  Route::post("freelance-comments", [FreelanceCommentController::class, "store"]);
  Route::post("freelance-comments/{id}", [FreelanceCommentController::class, "update"]);
  Route::delete("freelance-comments/{id}", [FreelanceCommentController::class, "destroy"]);

  // Certificates - REST API
  Route::post("certificates", [CertificateController::class, "store"]);
  Route::post("certificates/{id}", [CertificateController::class, "update"]);
  Route::delete("certificates/{id}", [CertificateController::class, "destroy"]);

  // Stack - REST API
  Route::post("stacks", [StackController::class, "store"]);
  Route::post("stacks/{id}", [StackController::class, "update"]);
  Route::delete("stacks/{id}", [StackController::class, "destroy"]);

// Skills Categories - REST API
Route::post("skills-categories", [SkillsCategoryController::class, "store"]);
Route::post("skills-categories/{id}", [SkillsCategoryController::class, "update"]);
Route::delete("skills-categories/{id}", [SkillsCategoryController::class, "destroy"]);

  // Permissions
  Route::get("permissions", [PermissionController::class, "index"]);
  Route::post("permissions", [PermissionController::class, "store"]);
  Route::put("permissions/{permission}", [PermissionController::class, "update"]);
  Route::delete("permissions/{permission}", [PermissionController::class, "destroy"]);
  Route::get("permissions/roles", [PermissionController::class, "getRolePermissions"]);
  Route::put("permissions/roles", [PermissionController::class, "updateRolePermissions"]);
  Route::post("permissions/sync", [PermissionController::class, "syncRoles"]);
  Route::get("permissions/sync-status", [PermissionController::class, "getSyncStatus"]);
});
