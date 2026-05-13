<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\UserPermission;
use Illuminate\Http\JsonResponse;
use TuOrg\SsoServer\Facades\SsoAuth;

class MyPermissionsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $user = SsoAuth::user();
        $userId = $user?->id;

        $userRoles = SsoAuth::roles();
        $roleSlugs = $this->extractRoleSlugs($userRoles);

        $rolePermissionSlugs = RolePermission::whereIn('role_slug', $roleSlugs)
            ->pluck('permission_slug')
            ->toArray();

        $overrides = UserPermission::where('user_sso_id', $userId)
            ->get()
            ->keyBy('permission_slug');

        $permissions = collect($rolePermissionSlugs)
            ->mapWithKeys(function ($slug) use ($overrides) {
                $override = $overrides->get($slug);
                if ($override && $override->type === 'deny') {
                    return [$slug => false];
                }
                return [$slug => true];
            });

        foreach ($overrides as $slug => $override) {
            if ($override->type === 'grant' && !$permissions->has($slug)) {
                $permissions[$slug] = true;
            }
        }

        if (in_array('admin', $roleSlugs)) {
            $permissions = Permission::pluck('slug')->mapWithKeys(fn ($s) => [$s => true]);
        }

        return response()->json([
            'roles' => $roleSlugs,
            'permissions' => $permissions,
        ]);
    }

    private function extractRoleSlugs($roles): array
    {
        if (empty($roles)) {
            return [];
        }

        if (is_array($roles)) {
            return array_filter(array_map(function ($role) {
                $roleArr = is_object($role) ? (array) $role : $role;
                return $roleArr['slug'] ?? null;
            }, $roles));
        }

        if (is_object($roles)) {
            if (isset($roles->slug)) {
                return [$roles->slug];
            }
        }

        return [];
    }
}