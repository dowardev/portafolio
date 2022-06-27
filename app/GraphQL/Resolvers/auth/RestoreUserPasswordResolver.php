<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\ResetCodePassword;
use App\Models\User;
use GraphQL\Error\Error;

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
      return Error::createLocatedError('Email is required');
    }
    if ($code == '' || $code == 'null') {
      return Error::createLocatedError('Code is required');
    }
    if ($password == '' || $password == null) {
      return Error::createLocatedError('Password is required');
    }

    $result = ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->get();

    if (sizeof($result) == 0) {
      return Error::createLocatedError('Code invalid');
    }

    ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->delete();
    User::where('email', '=', $email)->update([
      'password' => bcrypt($args['password']),
    ]);
  }
}
