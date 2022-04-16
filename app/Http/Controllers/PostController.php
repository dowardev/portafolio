<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
  function getImagePost(Request $request)
  {
    if (Storage::disk('tmp')->get($request->name)) {
      return Storage::disk('tmp')->get($request->name);
    } else {
      return Storage::disk('images_posts')->get($request->name);
    }
  }
}
