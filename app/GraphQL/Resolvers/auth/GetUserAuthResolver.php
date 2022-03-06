<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;

class GetUserAuthResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->check()) {
      $user = Auth::guard('api')->user();
      return [
        'msg' => 'Success',
        'user' => [$user],
      ];
    }
    return [
      'msg' => 'Unauthorized',
    ];
  }
}
