<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Freelance extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'url',
        'comment_title',
        'comment_text',
        'comment_rating',
    ];
}