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
  Route::post("error-report", [
    ErrorReportController::class,
    "createErrorReport",
  ]);
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
});

Route::middleware([Cors::class, 'sso.auth'])->get('my-permissions', \App\Http\Controllers\MyPermissionsController::class);

Route::middleware([Cors::class, 'sso.auth', 'permission:posts.create'])->post("create-post", [PostsController::class, "createPost"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:posts.update'])->post("update-post", [PostsController::class, "updatePost"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:posts.delete'])->post("delete-post", [PostsController::class, "deletePost"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:intro.update'])->post("admin/update-intro", [IntroProfileController::class, "updateIntro"]);

Route::middleware([Cors::class, 'sso.auth', 'sso.role:admin'])->prefix('admin')->group(function () {
  // Permissions catalog (CRUD)
  Route::get("permissions", [PermissionController::class, "getAvailablePermissions"]);
  Route::post("permissions", [PermissionController::class, "createPermission"]);
  Route::put("permissions/{id}", [PermissionController::class, "updatePermission"]);
  Route::delete("permissions/{id}", [PermissionController::class, "deletePermission"]);

  // Role permissions
  Route::get("permissions/roles", [PermissionController::class, "getRolePermissions"]);
  Route::put("permissions/roles", [PermissionController::class, "updateRolePermissions"]);

  // User permission overrides
  Route::get("permissions/user-override", [PermissionController::class, "getUserPermissions"])->name('permissions.user-override');
  Route::put("permissions/user-override", [PermissionController::class, "updateUserPermissions"]);

  // SSO sync
  Route::post("permissions/sync", [PermissionController::class, "syncRoles"]);
  Route::get("permissions/sync-status", [PermissionController::class, "getSyncStatus"]);
});

Route::middleware([Cors::class, 'sso.auth', 'permission:projects.create'])->post("admin/projects", [ProjectController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:projects.update'])->post("admin/projects/{id}", [ProjectController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:projects.delete'])->delete("admin/projects/{id}", [ProjectController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:experiences.create'])->post("admin/experiences", [ExperienceController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:experiences.update'])->post("admin/experiences/{id}", [ExperienceController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:experiences.delete'])->delete("admin/experiences/{id}", [ExperienceController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:freelance.create'])->post("admin/freelance-platforms", [FreelancePlatformController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:freelance.update'])->post("admin/freelance-platforms/{id}", [FreelancePlatformController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:freelance.delete'])->delete("admin/freelance-platforms/{id}", [FreelancePlatformController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:freelance-comments.create'])->post("admin/freelance-comments", [FreelanceCommentController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:freelance-comments.update'])->post("admin/freelance-comments/{id}", [FreelanceCommentController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:freelance-comments.delete'])->delete("admin/freelance-comments/{id}", [FreelanceCommentController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:certificates.create'])->post("admin/certificates", [CertificateController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:certificates.update'])->post("admin/certificates/{id}", [CertificateController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:certificates.delete'])->delete("admin/certificates/{id}", [CertificateController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:stacks.create'])->post("admin/stacks", [StackController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:stacks.update'])->post("admin/stacks/{id}", [StackController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:stacks.delete'])->delete("admin/stacks/{id}", [StackController::class, "destroy"]);

Route::middleware([Cors::class, 'sso.auth', 'permission:skills-categories.create'])->post("admin/skills-categories", [SkillsCategoryController::class, "store"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:skills-categories.update'])->post("admin/skills-categories/{id}", [SkillsCategoryController::class, "update"]);
Route::middleware([Cors::class, 'sso.auth', 'permission:skills-categories.delete'])->delete("admin/skills-categories/{id}", [SkillsCategoryController::class, "destroy"]);