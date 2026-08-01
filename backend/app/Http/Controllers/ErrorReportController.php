<?php

namespace App\Http\Controllers;

use App\Models\ErrorReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ErrorReportController extends Controller
{
    public function createErrorReport(Request $request)
    {
        $messages = [
            'message.required' => 'Message is required.',
            'stack.required' => 'Stack is required.',
        ];
        $validator = Validator::make(
            $request->all(),
            [
                'message' => 'required',
                'stack' => 'required',
            ],
            $messages
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $errorReport = ErrorReport::create([
            'message' => $request->message,
            'stack' => $request->stack,
            'timestamp' => $request->timestamp,
            'comments' => $request->comments,
        ]);

        return response()->json(['status' => 'success'], 201);
    }
}
