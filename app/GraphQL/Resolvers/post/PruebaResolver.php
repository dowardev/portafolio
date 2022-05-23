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
    return ['message' => 'ssss'];
  }
}
