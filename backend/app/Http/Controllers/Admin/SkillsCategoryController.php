<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SkillsCategory;
use App\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillsCategoryController extends Controller
{
    public function index()
    {
        $categories = SkillsSkillsCategory::with('technologies')->orderBy('sort_order', 'asc')->get();

        $skillsCategoriesData = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'sort_order' => $category->sort_order,
                'technologies' => $category->technologies->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'iconName' => $tech->name,
                        'category' => $tech->category,
                        'image' => $tech->image,
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
            'sort_order' => $request->input('sort_order', 0),
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
        $category->sort_order = $request->input('sort_order', $category->sort_order);
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
            } elseif (isset($techData['iconName'])) {
                $tech = Technology::where('name', $techData['iconName'])->first();
                if (!$tech) {
                    $tech = Technology::create([
                        'name' => $techData['iconName'],
                        'category' => $techData['category'] ?? null,
                        'image' => $techData['image'] ?? null,
                    ]);
                }
                $technologyIds[] = $tech->id;
            } elseif (isset($techData['name'])) {
                $tech = Technology::create([
                    'name' => $techData['name'],
                    'category' => $techData['category'] ?? null,
                    'image' => $techData['image'] ?? null,
                ]);
                $technologyIds[] = $tech->id;
            }
        }

        $category->technologies()->sync($technologyIds);
    }
}