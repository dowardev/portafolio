<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreelanceComment extends Model
{
    use HasFactory;

    protected $table = 'freelance_comments';

    protected $fillable = [
        'platform_id',
        'title',
        'text',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}