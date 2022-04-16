<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;

class GetPostsResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $post = Post::whereDate('created_at', $args['date'])->get();
    return ['message' => 'Success', 'posts' => $post];
  }
}
