<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('technologies')->orderBy('start_date', 'desc')->get();

        $projectsData = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'img' => $project->img,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status,
                'description' => $project->description,
                'website' => $project->website,
                'source_name' => $project->source_name,
                'source_url' => $project->source_url,
                'technologies' => $project->technologies->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'name' => $tech->name,
                        'category' => $tech->category,
                        'image' => $tech->image,
                    ];
                }),
            ];
        });

        return response()->json(['projects' => $projectsData]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'start_date' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->except(['image', 'technologies']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/projects/' . $fileName);
        }

        $project = Project::create($data);

        $this->syncTechnologies($project, $request->input('technologies', []));

        return response()->json(['project' => $project]);
    }

    public function show($id)
    {
        $project = Project::with('technologies')->findOrFail($id);
        return response()->json(['project' => $project]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $project = Project::findOrFail($id);
        $data = $request->except(['image', 'technologies']);

        if ($request->hasFile('image')) {
            if (!empty($project->img)) {
                $oldImagePath = $this->pathFromUrl($project->img);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/projects/' . $fileName);
        }

        $project->update($data);

        $this->syncTechnologies($project, $request->input('technologies', []));

        return response()->json(['project' => $project]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if (!empty($project->img)) {
            $oldImagePath = $this->pathFromUrl($project->img);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $project->delete();

        return response()->json(['success' => true]);
    }

    private function syncTechnologies($project, array $technologiesData): void
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

        $project->technologies()->sync($technologyIds);
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