<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tech extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon_id',
        'stack_id',
        'sort_order',
    ];

    protected $table = 'techs';

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Icon::class);
    }

    public function stack(): BelongsTo
    {
        return $this->belongsTo(Stack::class);
    }
}
