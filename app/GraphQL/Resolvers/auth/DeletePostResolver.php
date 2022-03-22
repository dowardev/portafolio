<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Images;
use Illuminate\Support\Facades\Auth;
use Exception;

class DeletePostResolver
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

    $id = intval($args['id']);

    $post_images = Post::find($id)->images;
    foreach ($post_images as $key => $value) {
      $image_name = Images::find($value->image_id)->name;
      Images::where('id', $value->image_id)->delete();
      Storage::delete('images_posts/' . $image_name);
    }

    $cover_id = Post::find($id)->cover_id;
    $image_name = Images::find($cover_id)->name;
    Storage::delete('images_posts/' . $image_name);
    Images::where('id', $cover_id)->delete();

    Post::where('id', $id)->delete();
    return ['message' => 'Success'];
  }
}
