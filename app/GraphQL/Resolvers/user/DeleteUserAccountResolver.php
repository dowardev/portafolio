<?php

namespace App\GraphQL\Resolvers\user;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use GraphQL\Error\Error;

class DeleteUserAccountResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = Auth::guard('api')->user();

    $email = $user->email;

    $credentials = [
      'email' => $email,
      'password' => strval($args['password']),
    ];

    if (!Auth::guard('web')->attempt($credentials)) {
      return Error::createLocatedError('Wrong password');
    }

    User::find($user->id)->delete();
  }
}
