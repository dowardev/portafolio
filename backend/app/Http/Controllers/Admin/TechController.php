<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Icon;
use App\Models\Tech;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TechController extends Controller
{
    public function index()
    {
        $techs = Tech::with('icon', 'stack')->orderBy('sort_order', 'asc')->get();

        $techsData = $techs->map(function ($tech) {
            return [
                'id' => $tech->id,
                'name' => $tech->name,
                'iconName' => $tech->icon?->name,
                'stackId' => $tech->stack_id,
                'sort_order' => $tech->sort_order,
            ];
        });

        return response()->json(['techs' => $techsData]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'stack_id' => 'required|exists:stacks,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = $request->only(['name', 'sort_order', 'stack_id']);

        if ($request->filled('icon_name')) {
            $icon = Icon::where('name', $request->icon_name)->first();
            if (! $icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        }

        $tech = Tech::create($data);

        return response()->json(['tech' => $tech->load('icon', 'stack')]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'stack_id' => 'sometimes|exists:stacks,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $tech = Tech::findOrFail($id);
        $data = $request->only(['name', 'sort_order', 'stack_id']);

        if ($request->filled('icon_name')) {
            $icon = Icon::where('name', $request->icon_name)->first();
            if (! $icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        } elseif ($request->has('icon_name') && ($request->icon_name === null || $request->icon_name === '')) {
            $data['icon_id'] = null;
        }

        $tech->update($data);

        return response()->json(['tech' => $tech->load('icon', 'stack')]);
    }

    public function destroy($id)
    {
        $tech = Tech::findOrFail($id);
        $tech->delete();

        return response()->json(['success' => true]);
    }
}
