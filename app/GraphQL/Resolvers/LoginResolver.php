<?php

namespace App\GraphQL\Resolvers;

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
    $user = User::where('user', '=', $args['user'])
      ->orWhere('email', '=', $args['user'])
      ->get();

    $credentials = [
      'email' => $user[0]->email,
      'password' => $args['password'],
    ];
    if (count($user) == 0 || !Auth::attempt($credentials)) {
      throw new Exception('Unauthorized');
    }

    if (!$user[0]->is_email_verified) {
      throw new Exception('Unverified email');
    }

    $us = User::find(1);
    $token = $us->createToken('Personal Access Token')->accessToken;

    return [
      'msg' => 'Authorized',
      'user' => [
        [
          'id' => $user[0]->id,
          'name' => $user[0]->name,
          'user' => $user[0]->user,
          'email' => $user[0]->email,
          'admin' => $user[0]->is_admin,
          'role' => $user[0]->role,
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
