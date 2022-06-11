<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\ResetCodePassword;
use App\Models\User;
use Exception;

class RestoreUserPasswordResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $email = $args['email'];
    $code = $args['code'];
    $password = $args['password'];

    if ($email == '' || $email == 'null') {
      throw new Exception('Email is required');
    }
    if ($code == '' || $code == 'null') {
      throw new Exception('Code is required');
    }
    if ($password == '' || $password == null) {
      throw new Exception('Password is required');
    }

    $result = ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->get();

    if (sizeof($result) == 0) {
      throw new Exception('Code invalid');
    }

    ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->delete();
    User::where('email', '=', $email)->update([
      'password' => bcrypt($args['password']),
    ]);
  }
}
