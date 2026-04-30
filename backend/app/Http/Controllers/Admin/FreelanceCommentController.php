<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FreelanceComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FreelanceCommentController extends Controller
{
    public function index()
    {
        $comments = FreelanceComment::orderBy('id', 'desc')->get();
        return response()->json(['freelanceComments' => $comments]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $comment = FreelanceComment::create($data);

        return response()->json(['freelanceComment' => $comment]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'platform_id' => 'sometimes|exists:freelance_platforms,id',
            'title' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $comment = FreelanceComment::findOrFail($id);
        $comment->update($data);

        return response()->json(['freelanceComment' => $comment]);
    }

    public function destroy($id)
    {
        $comment = FreelanceComment::findOrFail($id);
        $comment->delete();

        return response()->json(['success' => true]);
    }

    public function show($id)
    {
        $comment = FreelanceComment::with('platform')->findOrFail($id);
        return response()->json(['freelanceComment' => $comment]);
    }
}