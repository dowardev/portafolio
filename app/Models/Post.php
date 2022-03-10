<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = ['title', 'content', 'cover_id'];

    public function cover(): BelongsTo
    {
        return $this->belongsTo(Images::class, 'cover_id');
    }
}
