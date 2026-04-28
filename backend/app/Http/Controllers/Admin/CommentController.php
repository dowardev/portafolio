<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Freelance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Freelance::whereNotNull('comment_text')
            ->orWhereNotNull('comment_title')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['comments' => $comments]);
    }

    public function store(Request $request)
    {
        $data = $request->json()->all();

        $validator = Validator::make($data, [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $comment = Freelance::create($data);

        return response()->json(['comment' => $comment]);
    }

    public function show($id)
    {
        $comment = Freelance::findOrFail($id);
        return response()->json(['comment' => $comment]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->json()->all();

        $validator = Validator::make($data, [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $comment = Freelance::findOrFail($id);
        $comment->update($data);

        return response()->json(['comment' => $comment]);
    }

    public function destroy($id)
    {
        $comment = Freelance::findOrFail($id);
        $comment->delete();

        return response()->json(['success' => true]);
    }
}