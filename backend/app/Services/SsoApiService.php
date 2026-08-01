<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SsoApiService
{
    private string $ssoUrl;

    private string $clientId;

    private string $clientSecret;

    public function __construct()
    {
        $this->ssoUrl = config('sso.sso_url', 'http://localhost:8001/api');
        $this->clientId = config('sso.client_id', 'main-app');
        $this->clientSecret = config('sso.client_secret', '');
    }

    public function getUsers(?string $search = null, int $perPage = 50): array
    {
        $token = $this->getAccessToken();

        if (! $token) {
            return [];
        }

        try {
            $params = ['per_page' => $perPage];

            if ($search) {
                $params['search'] = $search;
            }

            $response = Http::withToken($token)
                ->get("{$this->ssoUrl}/users", $params);

            if ($response->successful()) {
                $data = $response->json('data', []);

                return collect($data)->map(function ($user) {
                    return [
                        'id' => $user['id'] ?? null,
                        'name' => $user['name'] ?? 'Sin nombre',
                        'user' => $user['user'] ?? '',
                        'email' => $user['email'] ?? '',
                    ];
                })->filter(fn ($u) => $u['id'])->values()->toArray();
            }

            if ($response->status() === 401) {
                $this->clearAccessToken();

                return $this->getUsers($search, $perPage);
            }

            Log::error('SSO API users request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('SSO API users request exception: '.$e->getMessage());
        }

        return [];
    }

    private function getAccessToken(): ?string
    {
        return Cache::remember('sso_client_credentials_token', 3300, function () {
            return $this->requestAccessToken();
        });
    }

    private function clearAccessToken(): void
    {
        Cache::forget('sso_client_credentials_token');
    }

    private function requestAccessToken(): ?string
    {
        if (empty($this->clientSecret)) {
            Log::error('SSO_CLIENT_SECRET not configured');

            return null;
        }

        try {
            $response = Http::asForm()->post("{$this->ssoUrl}/oauth/token", [
                'grant_type' => 'client_credentials',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]);

            if ($response->successful()) {
                return $response->json('token');
            }

            Log::error('SSO client_credentials token request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('SSO client_credentials token request exception: '.$e->getMessage());
        }

        return null;
    }
}
