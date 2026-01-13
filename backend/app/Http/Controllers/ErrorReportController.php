<?php

namespace App\Http\Controllers;

use App\Models\ErrorReport;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ErrorReportController extends Controller
{
  function createErrorReport(Request $request)
  {
    $messages = [
      "message.required" => "Message is required.",
      "stack.required" => "Stack is required.",
    ];
    $validator = Validator::make(
      $request->all(),
      [
        "message" => "required",
        "stack" => "required",
      ],
      $messages
    );

    if ($validator->fails()) {
      return response()->json(["errors" => $validator->errors()], 422);
    }

    $errorReport = ErrorReport::create([
      "message" => $request->message,
      "stack" => $request->stack,
      "timestamp" => $request->timestamp,
      "comments" => $request->comments,
    ]);
    return response()->json(["status" => "success"], 201);
  }
}
