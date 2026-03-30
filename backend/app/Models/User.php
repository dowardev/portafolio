<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'user',
        'email',
        'password',
        'image_id',
    ];

    protected $hidden = ['password', 'remember_token'];
}
