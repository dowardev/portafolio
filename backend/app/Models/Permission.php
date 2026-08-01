<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permission extends Model
{
    protected $fillable = [
        'slug',
        'module',
        'action',
        'description',
    ];

    public function rolePermissions(): HasMany
    {
        return $this->hasMany(RolePermission::class, 'permission_slug', 'slug');
    }

    public function userPermissions(): HasMany
    {
        return $this->hasMany(UserPermission::class, 'permission_slug', 'slug');
    }
}
