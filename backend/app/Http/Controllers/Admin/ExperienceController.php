<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::with('technologies')->orderBy('start_date', 'desc')->get();

        $experiencesData = $experiences->map(function ($experience) {
            return [
                'id' => $experience->id,
                'title' => $experience->title,
                'img' => $experience->img,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
                'description' => $experience->description,
                'website' => $experience->website,
                'technologies' => $experience->technologies->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'name' => $tech->name,
                        'category' => $tech->category,
                        'image' => $tech->image,
                    ];
                }),
            ];
        });

        return response()->json(['experiences' => $experiencesData]);
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

        $data = $request->except(['image', 'technologies']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/experience/' . $fileName);
        }

        $experience = Experience::create($data);

        $this->syncTechnologies($experience, $request->input('technologies', []));

        return response()->json(['experience' => $experience]);
    }

    public function show($id)
    {
        $experience = Experience::with('technologies')->findOrFail($id);
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
        $data = $request->except(['image', 'technologies']);

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

        $this->syncTechnologies($experience, $request->input('technologies', []));

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

    private function syncTechnologies($experience, array $technologiesData): void
    {
        $technologyIds = [];

        foreach ($technologiesData as $techData) {
            if (isset($techData['id']) && $techData['id']) {
                $tech = Technology::find($techData['id']);
                if ($tech) {
                    $tech->name = $techData['name'] ?? $tech->name;
                    $tech->category = $techData['category'] ?? $tech->category;
                    $tech->image = $techData['image'] ?? $tech->image;
                    $tech->save();
                    $technologyIds[] = $tech->id;
                }
            } else {
                $tech = Technology::create([
                    'name' => $techData['name'],
                    'category' => $techData['category'] ?? null,
                    'image' => $techData['image'] ?? null,
                ]);
                $technologyIds[] = $tech->id;
            }
        }

        $experience->technologies()->sync($technologyIds);
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