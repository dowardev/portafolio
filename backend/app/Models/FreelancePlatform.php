<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FreelancePlatform extends Model
{
    use HasFactory;

    protected $table = 'freelance_platforms';

    protected $fillable = [
        'name',
        'image',
        'url',
    ];

    public function comments(): HasMany
    {
        return $this->hasMany(FreelanceComment::class, 'platform_id');
    }
}
