<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;

class SystemController extends Controller
{
  function getTmpImage(Request $request)
  {
    return Storage::disk('tmp')->get($request->name);
  }
}
