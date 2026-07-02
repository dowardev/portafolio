<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $table = 'seo_settings';
    protected $fillable = [
        'site_title',
        'site_description',
        'site_image_path',
        'site_keywords',
        'lang_code',
        'og_site_name',
        'twitter_handle',
        'robots_index',
        'canonical_base',
        'admin_api_url',
    ];

    protected $casts = [
        'robots_index' => 'boolean',
    ];
}