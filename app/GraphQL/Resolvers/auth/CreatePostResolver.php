<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use App\Models\PostImage;

class CreatePostResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    // return ['msg' => json_encode($args['images'])];
    $post = Post::create([
      'title' => $args['title'],
      'content' => $args['content'],
      'cover_id' => $args['coverId'],
    ]);
    $post_id = $post->id;

    foreach ($args['images'] as $key => $value) {
      PostImage::create([
        'post_id' => $post_id,
        'image_id' => $value,
      ]);
    }
    return ['msg' => 'Success'];
  }
}
