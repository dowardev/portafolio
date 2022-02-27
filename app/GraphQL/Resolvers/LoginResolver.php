<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
      return ['msg' => 'Unauthorized', 'user' => null];
    }

    if (!$user[0]->is_email_verified) {
      return ['msg' => 'Unverified email', 'user' => null];
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
