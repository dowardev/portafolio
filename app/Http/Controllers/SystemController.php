<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Mail;

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
}
