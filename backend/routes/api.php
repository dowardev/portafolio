<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErrorReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Middleware\Cors;
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

  // Intro
  Route::post("admin/update-intro", [HomePageController::class, "updateIntro"]);

  // Projects - REST-like
  Route::post("admin/update-projects", [HomePageController::class, "updateProjects"]);
  Route::post("admin/add-project", [HomePageController::class, "addProject"]);
  Route::post("admin/delete-project", [HomePageController::class, "deleteProject"]);

  // Experience - REST-like
  Route::post("admin/update-experiences", [HomePageController::class, "updateExperiences"]);
  Route::post("admin/add-experience", [HomePageController::class, "addExperience"]);
  Route::post("admin/delete-experience", [HomePageController::class, "deleteExperience"]);

  // Freelance - REST-like
  Route::post("admin/update-freelance", [HomePageController::class, "updateFreelance"]);
  Route::post("admin/add-freelance", [HomePageController::class, "addFreelance"]);
  Route::post("admin/delete-freelance", [HomePageController::class, "deleteFreelance"]);

  // Skills - REST-like
  Route::post("admin/update-skills", [HomePageController::class, "updateSkills"]);
  Route::post("admin/add-skill-category", [HomePageController::class, "addSkillCategory"]);
  Route::post("admin/delete-skill-category", [HomePageController::class, "deleteSkillCategory"]);

  // Certificates - REST-like
  Route::post("admin/update-certificates", [HomePageController::class, "updateCertificates"]);
  Route::post("admin/add-certificate", [HomePageController::class, "addCertificate"]);
  Route::post("admin/delete-certificate", [HomePageController::class, "deleteCertificate"]);
});
