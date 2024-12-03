<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Feedbacks;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SystemController extends Controller
{
  // TODO: remove
  function getTmpImage(Request $request)
  {
    return Storage::disk("tmp")->get($request->name);
  }

  function uploadImage(Request $request)
  {
    $messages = [
      "file.required" => "File is required.",
      "file.image" => "The file must be an image.",
      "type.required" => "Type is required.",
    ];

    $validator = Validator::make(
      $request->all(),
      [
        "file" => "required|image",
        "type" => "required",
      ],
      $messages
    );

    if ($validator->fails()) {
      return response()->json(["errors" => $validator->errors()], 422);
    }

    $file = $request->file("file");
    $filename = uniqid() . time() . "." . $file->getClientOriginalExtension();
    $type = $request->type;
    $path = "";

    if ($type == "post") {
      $path = "posts_images";
    }

    Storage::disk($path)->put($filename, file_get_contents($file));

    $image = Image::create([
      "name" => $filename,
      "path" => $path,
      "status" => false,
    ]);

    $imgUrl = Storage::disk($path)->url($filename);

    return [
      "image" => [
        "id" => $image->id,
        "name" => $image->name,
        "url" => $imgUrl,
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

  // TODO: remove
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
  }
}
