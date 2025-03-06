<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
  public function createFeedback(Request $request)
  {
    $user_id = null;

    $user_id = $request->userId;
    $name = $request->name;
    $email = $request->email;
    $description = $request->description;
    $contact_me = $request->contactMe;

    Feedback::create([
      "user_id" => $user_id,
      "name" => $name,
      "email" => $email,
      "description" => $description,
      "contact_me" => $contact_me,
    ]);
  }
}
