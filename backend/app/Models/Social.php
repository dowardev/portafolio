<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Social extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'url',
        'icon_name',
    ];

    public function introProfiles(): BelongsToMany
    {
        return $this->belongsToMany(IntroProfile::class, 'intro_profile_socials');
    }
}