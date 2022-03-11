<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Support\Facades\Auth;
use Exception;

class CreatePostResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user()->is_admin == false) {
      throw new Exception('Unauthorized');
    }
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
    return ['message' => 'Success'];
  }
}
