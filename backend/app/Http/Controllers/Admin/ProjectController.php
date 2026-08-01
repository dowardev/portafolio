<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('start_date', 'desc')->get();

        $projectsData = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'img' => $project->img,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'description' => $project->description,
                'website' => $project->website,
                'source_name' => $project->source_name,
                'source_url' => $project->source_url,
                'technologies' => $project->technologies ?? [],
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
            $fileName = uniqid().time().'.'.$this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/projects/'.$fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/projects/'.$fileName);
        }

        $project = Project::create($data);

        $technologiesData = json_decode($request->input('technologies', '[]'), true) ?? [];
        $project->technologies = $technologiesData;
        $project->save();

        return response()->json(['project' => $project]);
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);

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
            if (! empty($project->img)) {
                $oldImagePath = $this->pathFromUrl($project->img);
                if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $file = $request->file('image');
            $fileName = uniqid().time().'.'.$this->getExtensionFromMime($file);
            Storage::disk('public')->put('homepage/projects/'.$fileName, file_get_contents($file));
            $data['img'] = url('api/serve-image?path=homepage/projects/'.$fileName);
        }

        $project->update($data);

        $technologiesData = json_decode($request->input('technologies', '[]'), true) ?? [];
        $project->technologies = $technologiesData;
        $project->save();

        return response()->json(['project' => $project]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if (! empty($project->img)) {
            $oldImagePath = $this->pathFromUrl($project->img);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $project->delete();

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
        if (! $url) {
            return null;
        }
        $parsed = parse_url($url);

        return ltrim($parsed['path'] ?? '', '/');
    }
}
