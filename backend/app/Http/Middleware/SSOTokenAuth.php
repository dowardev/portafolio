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

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al validar token con SSO'
            ], 500);
        }

        return $next($request);
    }
}
