<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        $ssoUser = $request->get('sso_user');
        $isAdmin = $request->get('is_admin', false);
        $roles = $request->get('roles', []);
        
        if ($ssoUser) {
            return response()->json([
                'id' => $ssoUser['id'],
                'name' => $ssoUser['name'],
                'user' => $ssoUser['user'],
                'email' => $ssoUser['email'],
                'is_admin' => $isAdmin,
                'is_email_verified' => $ssoUser['is_email_verified'] ?? false,
                'is_user_disabled' => $ssoUser['is_user_disabled'] ?? false,
                'roles' => $roles,
            ]);
        }
        
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
