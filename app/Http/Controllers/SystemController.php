<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Feedbacks;
use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SystemController extends Controller
{
  function getTmpImage(Request $request)
  {
    return Storage::disk("tmp")->get($request->name);
  }

  function uploadImage(Request $request)
  {
    $file = $request->file;
    $filename = uniqid() . time() . ".webp";
    $path = "/tmp/" . $filename;
    @list($type, $file_data) = explode(";", $file);
    @list(, $file_data) = explode(",", $file_data);
    Storage::disk("tmp")->put($filename, base64_decode($file_data));

    $messages = [
      "file.required" => "File is required.",
    ];

    $validator = Validator::make(
      $request->all(),
      [
        "file" => "required",
      ],
      $messages
    );

    $image = Images::create([
      "name" => $filename,
      "path" => $path,
    ]);
    return [
      "image" => [
        "id" => $image->id,
        "path" => $image->path,
      ],
    ];
  }

  public function createContactMessage(Request $request)
  {
    $name = $request->name;
    $subject = $request->subject;
    $email = $request->email;
    $description = $request->description;

    ContactMessage::create([
      "name" => $name,
      "subject" => $subject,
      "email" => $email,
      "description" => $description,
    ]);

    Mail::send("emails.emailContact", ["name" => $request["name"]], function (
      $message
    ) use ($email) {
      $message->to("contacto@dowar.xyz");
      $message->subject("Confirmación de contacto");
    });
  }

  public function createFeedback(Request $request)
  {
    $user = Auth::guard("api")->user();
    $user_id = null;

    $name = $request->name;
    $email = $request->email;
    $description = $request->description;
    $contact_me = $request->contactMe;
    $type = $request->type;

    if ($user != null) {
      $user_id = $user->id;
      $name = "";
      $email = "";
    }

    Feedbacks::create([
      "user_id" => $user_id,
      "name" => $name,
      "email" => $email,
      "description" => $description,
      "contact_me" => $contact_me,
      "type" => $type,
    ]);
  }

  public function getImage(Request $request)
  {
    $imageName = $request->input("name");
    $image = DB::table("images")->where("name", $imageName)->first();
    $diskName = $image->path;
    $url = Storage::disk($diskName)->url($imageName);
    return response()->json(
      [
        "id" => $image->id,
        "name" => $image->name,
        "url" => $url,
      ],
      200
    );

    // $imageName = $request->input("name");
    // $disk = "posts_images";
    // Storage::disk($disk)->put("m.txt", "funciona? x2");
    // $url = Storage::disk($disk)->url($imageName);
    // return response()->json(["url" => $url]);
  }
}
