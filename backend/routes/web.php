<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get("/", function () {
  return view("welcome");
});

Route::get("account/verify/{token}", [
  AuthController::class,
  "verifyAccount",
])->name("user.verify");

Route::get("account/verify/{token}/{email}", [
  AuthController::class,
  "verifyNewEmail",
])->name("user.new_email");
