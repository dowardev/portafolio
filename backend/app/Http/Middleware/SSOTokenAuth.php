<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class SSOTokenAuth
{
    protected string $ssoUrl;

    public function __construct()
    {
        $this->ssoUrl = rtrim(config('app.sso_url', env('SSO_URL', 'http://localhost:8002/api')), '/');
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Token no proporcionado'
            ], 401);
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ])->get($this->ssoUrl . '/me');

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Token inválido'
                ], 401);
            }

            $ssoUser = $response->json();
            $request->merge(['sso_user' => $ssoUser]);

            $isAdmin = $this->checkIsAdmin($ssoUser['roles'] ?? []);
            $roles = $ssoUser['roles'] ?? [];
            
            $request->merge([
                'is_admin' => $isAdmin,
                'roles' => $roles,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al validar token con SSO'
            ], 500);
        }

        return $next($request);
    }

    private function checkIsAdmin(array $roles): bool
    {
        foreach ($roles as $role) {
            if (isset($role['slug']) && $role['slug'] === 'admin') {
                return true;
            }
            if (isset($role['name']) && strtolower($role['name']) === 'administrador') {
                return true;
            }
        }
        return false;
    }
}
