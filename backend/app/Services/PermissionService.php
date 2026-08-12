<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\UserPermission;
use App\Traits\ExtractsRoleSlugs;
use Illuminate\Support\Facades\Cache;
use Dowardev\SsoServer\Facades\SsoAuth;

class PermissionService
{
    use ExtractsRoleSlugs;

    private const CACHE_TTL = 3600;

    public function getUserPermissions(): array
    {
        $user = SsoAuth::user();
        $userId = $user?->id;

        $roleSlugs = $this->getUserRoleSlugs();

        $cachedPermissions = $this->getCachedPermissions($roleSlugs, $userId);
        if ($cachedPermissions !== null) {
            return $cachedPermissions;
        }

        $permissions = $this->buildPermissions($roleSlugs, $userId);

        $this->cachePermissions($roleSlugs, $userId, $permissions);

        return $permissions;
    }

    public function hasPermission(string $permissionSlug): bool
    {
        $permissions = $this->getUserPermissions();

        return $permissions[$permissionSlug] ?? false;
    }

    public function hasAnyPermission(array $permissionSlugs): bool
    {
        $permissions = $this->getUserPermissions();
        foreach ($permissionSlugs as $slug) {
            if ($permissions[$slug] ?? false) {
                return true;
            }
        }

        return false;
    }

    public function getUserRoleSlugs(): array
    {
        $roles = SsoAuth::roles();

        return $this->extractRoleSlugs($roles);
    }

    public function clearUserCache(?string $userId = null): void
    {
        if ($userId) {
            Cache::forget("user_permissions_{$userId}");
        } else {
            $user = SsoAuth::user();
            if ($user?->id) {
                Cache::forget("user_permissions_{$user->id}");
            }
        }
    }

    private function getCachedPermissions(array $roleSlugs, ?string $userId): ?array
    {
        if (! $userId || empty($roleSlugs)) {
            return null;
        }

        return Cache::get("user_permissions_{$userId}");
    }

    private function cachePermissions(array $roleSlugs, ?string $userId, array $permissions): void
    {
        if (! $userId || empty($roleSlugs)) {
            return;
        }

        Cache::put("user_permissions_{$userId}", $permissions, self::CACHE_TTL);
    }

    private function buildPermissions(array $roleSlugs, ?string $userId): array
    {
        if (in_array('admin', $roleSlugs)) {
            return Permission::pluck('slug')
                ->mapWithKeys(fn ($s) => [$s => true])
                ->toArray();
        }

        $rolePermissionSlugs = RolePermission::whereIn('role_slug', $roleSlugs)
            ->pluck('permission_slug')
            ->toArray();

        $overrides = $userId
            ? UserPermission::where('user_sso_id', $userId)->get()->keyBy('permission_slug')
            : collect();

        $permissions = collect($rolePermissionSlugs)->mapWithKeys(function ($slug) use ($overrides) {
            $override = $overrides->get($slug);
            if ($override && $override->type === 'deny') {
                return [$slug => false];
            }

            return [$slug => true];
        })->toArray();

        foreach ($overrides as $slug => $override) {
            if ($override->type === 'grant' && ! isset($permissions[$slug])) {
                $permissions[$slug] = true;
            }
        }

        return $permissions;
    }
}
