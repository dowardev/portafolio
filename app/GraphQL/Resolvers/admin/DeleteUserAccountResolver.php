<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class DeleteUserAccountResolver
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

    User::where('email', $args['email'])->delete();

    return ['message' => 'User deleted', 'code' => 200];
  }
}
