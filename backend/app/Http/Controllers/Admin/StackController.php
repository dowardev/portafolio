<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Icon;
use App\Models\Stack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StackController extends Controller
{
    public function index()
    {
        $stacks = Stack::with('icon', 'techs.icon')->orderBy('sort_order', 'asc')->get();

        $stacksData = $stacks->map(function ($stack) {
            return [
                'id' => $stack->id,
                'name' => $stack->name,
                'iconName' => $stack->icon?->name,
                'sort_order' => $stack->sort_order,
                'techs' => $stack->techs->sortBy('sort_order')->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'name' => $tech->name,
                        'iconName' => $tech->icon?->name,
                        'sort_order' => $tech->sort_order,
                    ];
                })->values()->all(),
            ];
        });

        return response()->json(['stacks' => $stacksData]);
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
            if (! $icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        }

        $stack = Stack::create($data);

        return response()->json(['stack' => $stack->load('icon')]);
    }

    public function show($id)
    {
        $stack = Stack::with('icon', 'techs.icon')->findOrFail($id);

        return response()->json([
            'stack' => [
                'id' => $stack->id,
                'name' => $stack->name,
                'iconName' => $stack->icon?->name,
                'sort_order' => $stack->sort_order,
                'techs' => $stack->techs->sortBy('sort_order')->map(function ($tech) {
                    return [
                        'id' => $tech->id,
                        'name' => $tech->name,
                        'iconName' => $tech->icon?->name,
                        'stackId' => $tech->stack_id,
                        'sort_order' => $tech->sort_order,
                    ];
                })->values()->all(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $stack = Stack::findOrFail($id);
        $data = $request->only(['name', 'sort_order']);

        if ($request->filled('icon_name')) {
            $icon = Icon::where('name', $request->icon_name)->first();
            if (! $icon) {
                $icon = Icon::create(['name' => $request->icon_name]);
            }
            $data['icon_id'] = $icon->id;
        } elseif ($request->has('icon_name') && ($request->icon_name === null || $request->icon_name === '')) {
            $data['icon_id'] = null;
        }

        $stack->update($data);

        return response()->json(['stack' => $stack->load('icon')]);
    }

    public function destroy($id)
    {
        $stack = Stack::findOrFail($id);
        $stack->delete();

        return response()->json(['success' => true]);
    }
}
