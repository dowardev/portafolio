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
        $categories = SkillsCategory::with('icon')->get();

        $skillsCategoriesData = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'sort_order' => $category->sort_order,
                'iconName' => $category->icon?->name,
            ];
        });

        return response()->json(['skillsCategories' => $skillsCategoriesData]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->only(['name', 'sort_order']);

        if ($request->filled('icon_name')) {
            $icon = Icon::where('name', $request->icon_name)->first();
            if (!$icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        }

        $category = SkillsCategory::create($data);

        return response()->json(['skillsCategory' => $category->load('icon')]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $category = SkillsCategory::findOrFail($id);
        $data = $request->only(['name', 'sort_order']);

        if ($request->filled('icon_name')) {
            $icon = Icon::where('name', $request->icon_name)->first();
            if (!$icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        } elseif ($request->has('icon_name') && ($request->icon_name === null || $request->icon_name === '')) {
            $data['icon_id'] = null;
        }

        $category->update($data);

        return response()->json(['skillsCategory' => $category->load('icon')]);
    }

    public function destroy($id)
    {
        $category = SkillsCategory::findOrFail($id);
        $category->delete();

        return response()->json(['success' => true]);
    }
}
