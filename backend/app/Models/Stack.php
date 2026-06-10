<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon_id',
        'sort_order',
    ];

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Icon::class);
    }

    public function techs(): HasMany
    {
        return $this->hasMany(Tech::class);
    }
}
