<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class RoleSyncService
{
    private string $ssoUrl;
    private int $ttl;

    public function __construct()
    {
        $this->ssoUrl = config('sso.sso_url', 'http://localhost:8001/api');
        $this->ttl = config('sso.roles_cache_ttl', 3600);
    }

    public function getRoles(): array
    {
        return Cache::remember('sso_roles', $this->ttl, function () {
            return $this->fetchRoles();
        });
    }

    public function syncRoles(): array
    {
        Cache::forget('sso_roles');
        return $this->getRoles();
    }

    public function getLastSyncTime(): ?string
    {
        if (Cache::has('sso_roles')) {
            return Cache::get('sso_roles_synced_at');
        }
        return null;
    }

    public function getRoleSlugs(): array
    {
        $roles = $this->getRoles();
        return array_filter(array_map(function ($role) {
            return $role['slug'] ?? $role->slug ?? null;
        }, $roles));
    }

    private function fetchRoles(): array
    {
        $clientId = config('sso.client_id', 1);
        $response = Http::get("{$this->ssoUrl}/roles", [
            'client_id' => $clientId,
        ]);

        if ($response->successful()) {
            $roles = $response->json('data', []);
            Cache::put('sso_roles_synced_at', now()->toIso8601String(), $this->ttl);
            return $roles;
        }

        return [];
    }
}