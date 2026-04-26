<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'img',
        'start_date',
        'end_date',
        'status',
        'description',
        'website',
        'source_name',
        'source_url',
        'technologies',
    ];

    protected $casts = [
        'technologies' => 'array',
    ];
}