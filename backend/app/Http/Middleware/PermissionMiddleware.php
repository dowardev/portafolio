<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use TuOrg\SsoServer\Facades\SsoAuth;

class PermissionMiddleware
{
    public function handle(Request $request, string $permission): Response
    {
        if (!SsoAuth::isAuthenticated()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (SsoAuth::hasRole('admin')) {
            return $next($request);
        }

        $userRole = $this->getUserRole();

        if (!$userRole) {
            return response()->json(['error' => 'Sin rol asignado'], 403);
        }

        $hasPermission = RolePermission::where('role_slug', $userRole)
            ->whereHas('permission', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();

        if (!$hasPermission) {
            return response()->json(['error' => 'No tienes el permiso requerido'], 403);
        }

        return $next($request);
    }

    private function getUserRole(): ?string
    {
        $roles = SsoAuth::roles();

        if (empty($roles)) {
            return null;
        }

        if (is_array($roles) && isset($roles[0]['slug'])) {
            return $roles[0]['slug'];
        }

        if (is_object($roles) && isset($roles->slug)) {
            return $roles->slug;
        }

        return null;
    }
}