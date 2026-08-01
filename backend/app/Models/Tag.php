<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'sort_order',
    ];

    public function introProfiles(): BelongsToMany
    {
        return $this->belongsToMany(IntroProfile::class, 'intro_profile_tags');
    }
}
