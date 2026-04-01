<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    use HasFactory;

    protected $table = 'homepage';

    protected $fillable = [
        'name',
        'tags',
        'description',
        'socials',
        'logo_url',
        'photo_url',
        'stack',
        'skill_categories',
        'experience',
        'projects',
        'certificates',
        'freelance',
        'show_contact_form',
    ];

    protected $casts = [
        'tags' => 'array',
        'socials' => 'array',
        'stack' => 'array',
        'skill_categories' => 'array',
        'experience' => 'array',
        'projects' => 'array',
        'certificates' => 'array',
        'freelance' => 'array',
        'show_contact_form' => 'boolean',
    ];
}
