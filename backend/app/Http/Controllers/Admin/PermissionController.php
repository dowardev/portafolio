<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\UserPermission;
use App\Services\RoleSyncService;
use App\Services\SsoApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    private function parsePermissionSlug(string $slug): array
    {
        $parts = explode('.', $slug, 2);
        return [
            'slug' => $slug,
            'module' => $parts[0],
            'action' => $parts[1] ?? '',
        ];
    }

    public function getAvailablePermissions(): JsonResponse
    {
        $permissions = Permission::select('id', 'slug', 'module', 'action', 'description')->get();

        return response()->json(['permissions' => $permissions]);
    }

    public function createPermission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:permissions,slug',
            'module' => 'required|string|max:50',
            'action' => 'required|string|max:50',
        ]);

        $description = $request->input('description');
        if (empty($description)) {
            $description = ucfirst($request->action) . ' ' . $request->module;
        }

        $permission = Permission::create(array_merge($validated, ['description' => $description]));

        return response()->json([
            'message' => 'Permiso creado',
            'permission' => $this->parsePermissionSlug($permission->slug),
        ], 201);
    }

    public function updatePermission(Request $request, string $id): JsonResponse
    {
        $permission = Permission::findOrFail((int) $id);

        $validated = $request->validate([
            'slug' => 'sometimes|string|max:100|unique:permissions,slug,' . $id,
            'module' => 'sometimes|string|max:50',
            'action' => 'sometimes|string|max:50',
            'description' => 'sometimes|string|max:255',
        ]);

        $oldSlug = $permission->slug;

        try {
            DB::transaction(function () use ($permission, $validated, $oldSlug, $request) {
                $permission->update($validated);

                if (isset($validated['slug']) && $validated['slug'] !== $oldSlug) {
                    RolePermission::where('permission_slug', $oldSlug)
                        ->update(['permission_slug' => $validated['slug']]);
                    UserPermission::where('permission_slug', $oldSlug)
                        ->update(['permission_slug' => $validated['slug']]);
                }
            });
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al actualizar permiso'], 500);
        }

        return response()->json([
            'message' => 'Permiso actualizado',
            'permission' => $this->parsePermissionSlug($permission->slug),
        ]);
    }

    public function deletePermission(string $id): JsonResponse
    {
        $permission = Permission::findOrFail((int) $id);
        $slug = $permission->slug;

        try {
            DB::transaction(function () use ($permission, $slug) {
                RolePermission::where('permission_slug', $slug)->delete();
                UserPermission::where('permission_slug', $slug)->delete();
                $permission->delete();
            });

            return response()->json(['message' => 'Permiso eliminado']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al eliminar permiso'], 500);
        }
    }

    public function getRolePermissions(RoleSyncService $roleService): JsonResponse
    {
        $roleSlugs = $roleService->getRoleSlugs();
        $allPermissions = Permission::select('slug', 'module', 'action', 'description')->get()->map(function ($perm) {
            return [
                'slug' => $perm->slug,
                'module' => $perm->module,
                'action' => $perm->action,
                'description' => $perm->description,
            ];
        });

        $rolePermissions = RolePermission::all()->groupBy('role_slug');

        $result = [];
        foreach ($roleSlugs as $roleSlug) {
            $rolePerms = $rolePermissions->get($roleSlug, collect())->pluck('permission_slug')->toArray();
            $result[$roleSlug] = $allPermissions->map(function ($perm) use ($rolePerms) {
                return array_merge($perm, ['enabled' => in_array($perm['slug'], $rolePerms)]);
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateRolePermissions(Request $request, RoleSyncService $roleService): JsonResponse
    {
        $roleSlugs = $roleService->getRoleSlugs();
        $allSlugs = Permission::pluck('slug')->toArray();

        $validated = $request->validate([
            'role_slug' => 'required|string|in:' . implode(',', $roleSlugs),
            'permission_slugs' => 'required|array',
            'permission_slugs.*' => 'string|in:' . implode(',', $allSlugs),
        ]);

        try {
            DB::transaction(function () use ($validated) {
                RolePermission::where('role_slug', $validated['role_slug'])->delete();

                foreach ($validated['permission_slugs'] as $slug) {
                    RolePermission::create([
                        'role_slug' => $validated['role_slug'],
                        'permission_slug' => $slug,
                    ]);
                }
            });

            return response()->json(['message' => 'Permisos del rol actualizados']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al actualizar permisos'], 500);
        }
    }

    public function getUserPermissions(Request $request): JsonResponse
    {
        $userSsoId = $request->query('user_sso_id');

        $permissions = Permission::all()->map(function ($perm) {
            return [
                'slug' => $perm->slug,
                'module' => $perm->module,
                'action' => $perm->action,
            ];
        });

        $userPermissionsQuery = UserPermission::query();
        if ($userSsoId) {
            $userPermissionsQuery->where('user_sso_id', $userSsoId);
        }
        $userPermissions = $userPermissionsQuery->get()->groupBy('user_sso_id');

        $result = [];
        foreach ($userPermissions as $userId => $userPerms) {
            $result[$userId] = $permissions->map(function ($perm) use ($userPerms) {
                $override = $userPerms->firstWhere('permission_slug', $perm['slug']);
                return array_merge($perm, [
                    'type' => $override?->type ?? null,
                ]);
            })->toArray();
        }

        if ($userSsoId && !isset($result[$userSsoId])) {
            $result[$userSsoId] = $permissions->map(function ($perm) {
                return array_merge($perm, ['type' => null]);
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateUserPermissions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_sso_id' => 'required|string|max:36',
            'permissions' => 'required|array',
            'permissions.*.slug' => 'required|string',
            'permissions.*.type' => 'sometimes|nullable|in:grant,deny',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                UserPermission::where('user_sso_id', $validated['user_sso_id'])->delete();

                foreach ($validated['permissions'] as $perm) {
                    if ($perm['type'] !== null && $perm['type'] !== '') {
                        UserPermission::create([
                            'user_sso_id' => $validated['user_sso_id'],
                            'permission_slug' => $perm['slug'],
                            'type' => $perm['type'],
                        ]);
                    }
                }
            });

            return response()->json(['message' => 'Permisos de usuario actualizados']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al actualizar permisos'], 500);
        }
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

    public function getSsoUsers(Request $request, SsoApiService $ssoApi): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 50);

        $users = $ssoApi->getUsers($search, $perPage);

        return response()->json(['users' => $users]);
    }
}