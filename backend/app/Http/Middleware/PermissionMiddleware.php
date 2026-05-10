<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use App\Models\UserPermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use TuOrg\SsoServer\Facades\SsoAuth;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!SsoAuth::isAuthenticated()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $user = SsoAuth::user();
        $userId = $user?->id;

        if ($userId) {
            $override = UserPermission::where('user_sso_id', $userId)
                ->where('permission_slug', $permission)
                ->first();

            if ($override) {
                if ($override->type === 'deny') {
                    return response()->json(['error' => 'No tienes el permiso requerido'], 403);
                }
                if ($override->type === 'grant') {
                    return $next($request);
                }
            }
        }

        $userRoles = SsoAuth::roles();
        $roleSlugs = $this->extractRoleSlugs($userRoles);

        if (empty($roleSlugs)) {
            return response()->json(['error' => 'Sin rol asignado'], 403);
        }

        $hasPermission = RolePermission::whereIn('role_slug', $roleSlugs)
            ->where('permission_slug', $permission)
            ->exists();

        if (!$hasPermission) {
            return response()->json(['error' => 'No tienes el permiso requerido'], 403);
        }

        return $next($request);
    }

    private function extractRoleSlugs($roles): array
    {
        if (empty($roles)) {
            return [];
        }

        if (is_array($roles)) {
            return array_filter(array_map(function ($role) {
                return $role['slug'] ?? $role->slug ?? null;
            }, $roles));
        }

        if (is_object($roles) && isset($roles->slug)) {
            return [$roles->slug];
        }

        return [];
    }
}