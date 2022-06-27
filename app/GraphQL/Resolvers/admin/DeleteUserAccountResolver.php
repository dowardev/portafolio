<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

class DeleteUserAccountResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user() == null) {
      return Error::createLocatedError('Unauthorized');
    }

    if (Auth::guard('api')->user()->is_admin == false) {
      return Error::createLocatedError('Unauthorized');
    }

    User::where('email', $args['email'])->delete();
  }
}
