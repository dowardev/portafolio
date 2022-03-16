<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Images;
use App\Models\PostImage;

class UpdatePostResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $id = intval($args['id']);
    $title = $args['title'];
    $content = $args['content'];
    $cover_id = intval($args['coverId']);
    $new_cover_id = intval($args['newCoverId']);
    $new_images = $args['images'];
    $images_removed = $args['imagesRemoved'];

    Post::where('id', '=', $id)->update([
      'title' => $title,
      'content' => $content,
    ]);

    if ($new_cover_id != 0) {
      $cover_name = Images::where('id', '=', $cover_id)->get()[0]->name;
      Post::where('id', '=', $id)->update([
        'cover_id' => $new_cover_id,
      ]);
      Storage::delete('images_posts/' . $cover_name);
      Images::where('id', '=', $cover_id)->delete();
    }

    foreach ($images_removed as $key => $value) {
      Storage::delete('images_posts/' . $value);
      Images::where('name', '=', $value)->delete();
    }

    foreach ($new_images as $key => $value) {
      PostImage::create([
        'image_id' => $value,
        'post_id' => $id,
      ]);
    }

    return ['message' => 'Success'];
  }
}
