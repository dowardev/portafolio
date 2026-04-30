<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SkillsCategory;
use App\Models\Icon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillsCategoryController extends Controller
{
    public function index()
    {
        $categories = SkillsCategory::with('technologies')->get();

        $skillsCategoriesData = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'technologies' => $category->technologies->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'iconName' => $tech->name,
                    ];
                }),
            ];
        });

        return response()->json(['skillsCategories' => $skillsCategoriesData]);
    }

    public function store(Request $request)
    {
        $name = $request->get('name') ?? $request->input('name');

        if (empty($name)) {
            return response()->json(['error' => 'El nombre es requerido'], 422);
        }

        $category = SkillsCategory::create([
            'name' => $name,
        ]);

        $technologiesData = $request->input('technologies', []);
        if (is_string($technologiesData)) {
            $technologiesData = json_decode($technologiesData, true) ?? [];
        }
        $this->syncTechnologies($category, $technologiesData);

        return response()->json(['skillsCategory' => $category]);
    }

    public function update(Request $request, $id)
    {
        $name = $request->get('name') ?? $request->input('name');

        if (empty($name)) {
            return response()->json(['error' => 'El nombre es requerido'], 422);
        }

        $category = SkillsCategory::findOrFail($id);

        $category->name = $name;
        $category->save();

        $technologiesData = $request->input('technologies', []);
        if (is_string($technologiesData)) {
            $technologiesData = json_decode($technologiesData, true) ?? [];
        }
        $this->syncTechnologies($category, $technologiesData);

        return response()->json(['skillsCategory' => $category]);
    }

    public function destroy($id)
    {
        $category = SkillsCategory::findOrFail($id);
        $category->delete();

        return response()->json(['success' => true]);
    }

    private function syncTechnologies($category, array $technologiesData): void
    {
        $iconIds = [];

        foreach ($technologiesData as $techData) {
            if (isset($techData['id']) && $techData['id']) {
                $icon = Icon::find($techData['id']);
                if ($icon) {
                    $icon->name = $techData['name'] ?? $icon->name;
                    $icon->save();
                    $iconIds[] = $icon->id;
                }
            } elseif (isset($techData['iconName'])) {
                $icon = Icon::where('name', $techData['iconName'])->first();
                if (!$icon) {
                    $icon = Icon::create([
                        'name' => $techData['iconName'],
                    ]);
                }
                $iconIds[] = $icon->id;
            } elseif (isset($techData['name'])) {
                $icon = Icon::create([
                    'name' => $techData['name'],
                ]);
                $iconIds[] = $icon->id;
            }
        }

        $category->technologies()->sync($iconIds);
    }
}