<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'user',
        'email',
        'password',
        'image_id',
    ];

    protected $hidden = ['password', 'remember_token'];
}
