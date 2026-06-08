<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class IntroProfile extends Model
{
    use HasFactory;

    protected $table = 'intro_profiles';

    protected $fillable = [
        'name',
        'username',
        'description',
        'logo_url',
        'photo_url',
        'show_contact_form',
        'show_footer',
        'footer_content',
    ];

    protected $casts = [
        'show_contact_form' => 'boolean',
        'show_footer' => 'boolean',
    ];

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'intro_profile_tags');
    }

    public function socials(): BelongsToMany
    {
        return $this->belongsToMany(Social::class, 'intro_profile_socials');
    }
}