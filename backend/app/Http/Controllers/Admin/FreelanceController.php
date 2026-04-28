<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Freelance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FreelanceController extends Controller
{
    public function index()
    {
        $freelances = Freelance::orderBy('id', 'desc')->get();
        return response()->json(['freelances' => $freelances]);
    }

    public function storePlatform(Request $request)
    {
        $data = $request->except(['image']);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
            $data['image'] = url('api/serve-image?path=homepage/freelance/' . $fileName);
        }

        $freelance = Freelance::create($data);

        return response()->json(['freelance' => $freelance]);
    }

    public function updatePlatform(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $freelance = Freelance::findOrFail($id);
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if (!empty($freelance->image)) {
                $oldImagePath = $this->pathFromUrl($freelance->image);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
            $data['image'] = url('api/serve-image?path=homepage/freelance/' . $fileName);
        }

        $freelance->update($data);

        return response()->json(['freelance' => $freelance]);
    }

    public function destroyPlatform($id)
    {
        $freelance = Freelance::findOrFail($id);

        if (!empty($freelance->image)) {
            $oldImagePath = $this->pathFromUrl($freelance->image);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $freelance->delete();

        return response()->json(['success' => true]);
    }

    public function show($id)
    {
        $freelance = Freelance::findOrFail($id);
        return response()->json(['freelance' => $freelance]);
    }

    public function store(Request $request)
    {
        return $this->storePlatform($request);
    }

    public function update(Request $request, $id)
    {
        return $this->updatePlatform($request, $id);
    }

    public function destroy($id)
    {
        return $this->destroyPlatform($id);
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