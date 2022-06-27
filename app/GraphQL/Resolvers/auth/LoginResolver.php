<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

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
      return Error::createLocatedError('User is required');
    }
    if ($password == '' || $password == 'null') {
      return Error::createLocatedError('Password is required');
    }

    $userData = User::where('user', '=', $user)
      ->orWhere('email', '=', $user)
      ->get();

    if (count($userData) == 0) {
      return Error::createLocatedError('Not found');
    }

    if ($userData[0]->is_user_disabled) {
      return Error::createLocatedError('Disabled user');
    }

    $credentials = [
      'email' => $userData[0]->email,
      'password' => $password,
    ];
    try {
      if (count($userData) == 0 || !Auth::guard('web')->attempt($credentials)) {
        return Error::createLocatedError('Unauthorized');
      }
    } catch (\Throwable $error) {
      $errorPool = app(\Nuwave\Lighthouse\Execution\ErrorPool::class);
      $errorPool->record($error);
    }

    if (!$userData[0]->is_email_verified) {
      return Error::createLocatedError('Unverified email');
    }

    $token = $userData[0]->createToken('Personal Access Token')->accessToken;

    return [
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
        'access_token' => $token,
        'token_type' => 'Bearer',
      ],
    ];
  }
}
