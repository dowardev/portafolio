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
    ];

    protected $casts = [
        'tags' => 'array',
        'socials' => 'array',
    ];
}
