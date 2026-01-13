<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
  use HasApiTokens, HasFactory, Notifiable;
  protected $fillable = ["title", "content", "cover_id", "status"];

  public function cover()
  {
    return $this->belongsTo(Image::class, "cover_id");
  }

  public function images(): HasMany
  {
    return $this->hasMany(PostImage::class, "post_id");
  }

  public function image()
  {
    return $this->hasOne(Image::class);
  }
}
