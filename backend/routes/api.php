<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErrorReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Middleware\Cors;
use App\Http\Middleware\SSOTokenAuth;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

Route::middleware([Cors::class])->group(function () {
  Route::post("upload-image", [SystemController::class, "uploadImage"]);
  Route::post("contact", [SystemController::class, "createContactMessage"]);
  Route::post("feedback", [FeedbackController::class, "createFeedback"]);
  Route::get("get-image", [SystemController::class, "getImage"]);
  Route::get("get-intro", [HomePageController::class, "getIntro"]);
  Route::get("get-projects", [HomePageController::class, "getProjects"]);
  Route::get("get-experiences", [HomePageController::class, "getExperiences"]);
  Route::get("get-freelance", [HomePageController::class, "getFreelance"]);
  Route::get("get-skills", [HomePageController::class, "getSkills"]);
  Route::get("get-certificates", [HomePageController::class, "getCertificates"]);
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

Route::middleware([Cors::class, 'sso.auth'])->group(function () {
  Route::get("user-auth", [AuthController::class, "user"]);
  Route::post("new-post", [PostsController::class, "createPost"]);
});

Route::middleware([Cors::class, 'sso.auth', 'admin.only'])->prefix('admin')->group(function () {
  // Intro
  Route::post("update-intro", [HomePageController::class, "updateIntro"]);

  // Projects - REST-like
  Route::post("update-projects", [HomePageController::class, "updateProjects"]);
  Route::post("add-project", [HomePageController::class, "addProject"]);
  Route::post("delete-project", [HomePageController::class, "deleteProject"]);

  // Experience - REST-like
  Route::post("update-experiences", [HomePageController::class, "updateExperiences"]);
  Route::post("add-experience", [HomePageController::class, "addExperience"]);
  Route::post("delete-experience", [HomePageController::class, "deleteExperience"]);

  // Freelance - REST-like
  Route::post("update-freelance", [HomePageController::class, "updateFreelance"]);
  Route::post("add-freelance", [HomePageController::class, "addFreelance"]);
  Route::post("delete-freelance", [HomePageController::class, "deleteFreelance"]);

  // Skills - REST-like
  Route::post("update-skills", [HomePageController::class, "updateSkills"]);
  Route::post("add-skill-category", [HomePageController::class, "addSkillCategory"]);
  Route::post("delete-skill-category", [HomePageController::class, "deleteSkillCategory"]);

  // Certificates - REST-like
  Route::post("update-certificates", [HomePageController::class, "updateCertificates"]);
  Route::post("add-certificate", [HomePageController::class, "addCertificate"]);
  Route::post("delete-certificate", [HomePageController::class, "deleteCertificate"]);
});
