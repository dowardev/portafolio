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
        'sort_order',
    ];

    protected $table = 'categories_skills';

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(
            Technology::class, 
            'category_skills_technologies',
            'category_id',
            'technology_id'
        );
    }
}