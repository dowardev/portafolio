<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::orderBy('start_date', 'desc')->get();
        return response()->json(['experiences' => $experiences]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'start_date' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/experience/' . $fileName);
        }

        $experience = Experience::create($data);

        return response()->json(['experience' => $experience]);
    }

    public function show($id)
    {
        $experience = Experience::findOrFail($id);
        return response()->json(['experience' => $experience]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'start_date' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $experience = Experience::findOrFail($id);
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if (!empty($experience->img)) {
                $oldImagePath = $this->pathFromUrl($experience->img);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/experience/' . $fileName);
        }

        $experience->update($data);

        return response()->json(['experience' => $experience]);
    }

    public function destroy($id)
    {
        $experience = Experience::findOrFail($id);

        if (!empty($experience->img)) {
            $oldImagePath = $this->pathFromUrl($experience->img);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $experience->delete();

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