<?php

namespace App\Traits;

trait ExtractsRoleSlugs
{
    protected function extractRoleSlugs($roles): array
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