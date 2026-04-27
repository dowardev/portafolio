<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntroProfile extends Model
{
    use HasFactory;

    protected $table = 'intro_profiles';

    protected $fillable = [
        'name',
        'tags',
        'description',
        'socials',
        'logo_url',
        'photo_url',
        'show_contact_form',
    ];

    protected $casts = [
        'tags' => 'array',
        'socials' => 'array',
        'show_contact_form' => 'boolean',
    ];
}