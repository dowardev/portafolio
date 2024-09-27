<?php

namespace App\Http\Controllers;

use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;

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
}
