<?php

namespace App\GraphQL\Resolvers\others;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Support\Facades\Auth;

class PruebaResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = Auth::guard('api')->user()->is_admin == false;
    return ['message' => json_encode($user)];
  }
}
