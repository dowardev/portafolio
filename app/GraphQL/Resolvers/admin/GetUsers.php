<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class GetUsers
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user() == null) {
      throw new Exception('Unauthorized');
    }

    if (Auth::guard('api')->user()->is_admin == false) {
      throw new Exception('Unauthorized');
    }

    return DB::table('users');
  }
}
