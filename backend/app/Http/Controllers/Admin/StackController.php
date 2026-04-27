<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StackController extends Controller
{
    public function index()
    {
        $stacks = Stack::orderBy('sort_order', 'asc')->get();
        return response()->json(['stacks' => $stacks]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/stack/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/stack/' . $fileName);
        }

        $stack = Stack::create($data);

        return response()->json(['stack' => $stack]);
    }

    public function show($id)
    {
        $stack = Stack::findOrFail($id);
        return response()->json(['stack' => $stack]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $stack = Stack::findOrFail($id);
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if (!empty($stack->img)) {
                $oldImagePath = $this->pathFromUrl($stack->img);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/stack/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/stack/' . $fileName);
        }

        $stack->update($data);

        return response()->json(['stack' => $stack]);
    }

    public function destroy($id)
    {
        $stack = Stack::findOrFail($id);

        if (!empty($stack->img)) {
            $oldImagePath = $this->pathFromUrl($stack->img);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $stack->delete();

        return response()->json(['success' => true]);
    }

    private function getExtensionFromMime($file)
    {
        $mimeType = $file->getMimeType();
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg',
        ];
        return $extensions[$mimeType] ?? 'jpg';
    }

    private function pathFromUrl($url)
    {
        if (!$url) return null;
        $parsed = parse_url($url);
        return ltrim($parsed['path'] ?? '', '/');
    }
}