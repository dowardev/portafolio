<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use App\Models\UserPermission;
use App\Traits\ExtractsRoleSlugs;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Dowardev\SsoServer\Facades\SsoAuth;

class PermissionMiddleware
{
    use ExtractsRoleSlugs;

    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! SsoAuth::isAuthenticated()) {
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

        if (in_array('admin', $roleSlugs)) {
            return $next($request);
        }

        $hasPermission = RolePermission::whereIn('role_slug', $roleSlugs)
            ->where('permission_slug', $permission)
            ->exists();

        if (! $hasPermission) {
            return response()->json(['error' => 'No tienes el permiso requerido'], 403);
        }

        return $next($request);
    }
}
