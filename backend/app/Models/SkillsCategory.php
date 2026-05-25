<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillsCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sort_order',
        'icon_id',
    ];

    protected $table = 'categories_skills';

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Icon::class);
    }
}
