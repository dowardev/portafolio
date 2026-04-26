<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::orderBy('id', 'desc')->get();
        return response()->json(['certificates' => $certificates]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/certificates/' . $fileName);
        }

        $certificate = Certificate::create($data);

        return response()->json(['certificate' => $certificate]);
    }

    public function show($id)
    {
        $certificate = Certificate::findOrFail($id);
        return response()->json(['certificate' => $certificate]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $certificate = Certificate::findOrFail($id);
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if (!empty($certificate->img)) {
                $oldImagePath = $this->pathFromUrl($certificate->img);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/certificates/' . $fileName);
        }

        $certificate->update($data);

        return response()->json(['certificate' => $certificate]);
    }

    public function destroy($id)
    {
        $certificate = Certificate::findOrFail($id);

        if (!empty($certificate->img)) {
            $oldImagePath = $this->pathFromUrl($certificate->img);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $certificate->delete();

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