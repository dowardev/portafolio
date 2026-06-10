<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Icon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'pack_name',
    ];

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_icons');
    }

    public function experiences(): BelongsToMany
    {
        return $this->belongsToMany(Experience::class, 'experience_icons');
    }

    public function socials(): HasMany
    {
        return $this->hasMany(Social::class);
    }

    public function techs(): HasMany
    {
        return $this->hasMany(Tech::class);
    }
}