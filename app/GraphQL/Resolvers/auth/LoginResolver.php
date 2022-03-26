<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;

class LoginResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = $args['user'];
    $password = $args['password'];

    if ($user == '' || $user == 'null') {
      throw new Exception('User is required');
    }
    if ($password == '' || $password == 'null') {
      throw new Exception('Password is required');
    }

    $userData = User::where('user', '=', $user)
      ->orWhere('email', '=', $user)
      ->get();

    $credentials = [
      'email' => $userData[0]->email,
      'password' => $password,
    ];
    if (count($userData) == 0 || !Auth::attempt($credentials)) {
      throw new Exception('Unauthorized');
    }

    if (!$userData[0]->is_email_verified) {
      throw new Exception('Unverified email');
    }

    $token = $userData[0]->createToken('Personal Access Token')->accessToken;

    return [
      'message' => 'Authorized',
      'user' => [
        [
          'name' => $userData[0]->name,
          'user' => $userData[0]->user,
          'email' => $userData[0]->email,
          'is_admin' => $userData[0]->is_admin,
          'role' => $userData[0]->role,
        ],
      ],
      'auth' => [
        [
          'access_token' => $token,
          'token_type' => 'Bearer',
        ],
      ],
    ];
  }
}
