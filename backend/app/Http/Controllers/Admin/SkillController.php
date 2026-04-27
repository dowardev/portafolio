<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('category', 'asc')->orderBy('sort_order', 'asc')->get();
        return response()->json(['skills' => $skills]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('skills/' . $fileName, file_get_contents($file));
            $data['image'] = url('api/serve-image?path=skills/' . $fileName);
        }

        $skill = Skill::create($data);

        return response()->json(['skill' => $skill]);
    }

    public function show($id)
    {
        $skill = Skill::findOrFail($id);
        return response()->json(['skill' => $skill]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $skill = Skill::findOrFail($id);
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if (!empty($skill->image)) {
                $oldImagePath = $this->pathFromUrl($skill->image);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('skills/' . $fileName, file_get_contents($file));
            $data['image'] = url('api/serve-image?path=skills/' . $fileName);
        }

        $skill->update($data);

        return response()->json(['skill' => $skill]);
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);

        if (!empty($skill->image)) {
            $oldImagePath = $this->pathFromUrl($skill->image);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $skill->delete();

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