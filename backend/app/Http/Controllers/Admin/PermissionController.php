<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Services\RoleSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Permission::orderBy('module')->orderBy('name');

        if ($request->has('module')) {
            $query->where('module', $request->module);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:permissions,slug|max:255',
            'name' => 'required|string|max:255',
            'module' => 'required|string|max:100',
        ]);

        $permission = Permission::create($validated);

        return response()->json(['message' => 'Permiso creado', 'permission' => $permission], 201);
    }

    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'module' => 'sometimes|string|max:100',
        ]);

        $permission->update($validated);

        return response()->json(['message' => 'Permiso actualizado', 'permission' => $permission]);
    }

    public function destroy(Permission $permission): JsonResponse
    {
        RolePermission::where('permission_id', $permission->id)->delete();
        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado']);
    }

    public function getRolePermissions(RoleSyncService $roleService): JsonResponse
    {
        $roles = $roleService->getRoles();
        $roleSlugs = array_map(fn($r) => $r['slug'] ?? $r->slug ?? null, $roles);
        $roleSlugs = array_filter($roleSlugs);

        $permissions = Permission::orderBy('module')->orderBy('name')->get();
        $rolePermissions = RolePermission::all()->groupBy('role_slug');

        $result = [];
        foreach ($roleSlugs as $roleSlug) {
            $rolePerms = $rolePermissions->get($roleSlug, collect())->pluck('permission_id');
            $result[$roleSlug] = $permissions->map(function ($perm) use ($rolePerms) {
                return [
                    'id' => $perm->id,
                    'slug' => $perm->slug,
                    'name' => $perm->name,
                    'module' => $perm->module,
                    'enabled' => $rolePerms->contains($perm->id),
                ];
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateRolePermissions(Request $request, RoleSyncService $roleService): JsonResponse
    {
        $roles = $roleService->getRoles();
        $validSlugs = array_map(fn($r) => $r['slug'] ?? $r->slug ?? null, $roles);
        $validSlugs = array_filter($validSlugs);
        $validSlugsStr = implode(',', $validSlugs);

        $validated = $request->validate([
            'role_slug' => 'required|string|in:' . $validSlugsStr,
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        RolePermission::where('role_slug', $validated['role_slug'])->delete();

        foreach ($validated['permission_ids'] as $permissionId) {
            RolePermission::create([
                'role_slug' => $validated['role_slug'],
                'permission_id' => $permissionId,
            ]);
        }

        return response()->json(['message' => 'Permisos del rol actualizados']);
    }

    public function syncRoles(RoleSyncService $service): JsonResponse
    {
        $roles = $service->syncRoles();

        return response()->json([
            'message' => 'Roles sincronizados',
            'roles' => $roles,
            'synced_at' => now()->toIso8601String(),
        ]);
    }

    public function getSyncStatus(RoleSyncService $service): JsonResponse
    {
        $roles = $service->getRoles();
        $lastSync = $service->getLastSyncTime();

        return response()->json([
            'roles' => $roles,
            'last_sync' => $lastSync,
        ]);
    }
}