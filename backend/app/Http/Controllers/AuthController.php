<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use TuOrg\SsoServer\Facades\SsoAuth;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        if (!SsoAuth::isAuthenticated()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $ssoUser = SsoAuth::user();

        return response()->json([
            'id' => $ssoUser->id,
            'name' => $ssoUser->name,
            'user' => $ssoUser->userName,
            'email' => $ssoUser->email,
            'is_email_verified' => !is_null($ssoUser->email_verified_at),
            'is_user_disabled' => $ssoUser->is_user_disabled ?? false,
            'roles' => $ssoUser->roles,
        ]);
    }
}
