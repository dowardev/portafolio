<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SkillsCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $table = 'categories_skills';

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(
            Icon::class,
            'category_skills_tech',
            'category_id',
            'icon_id'
        );
    }
}