<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Storage;
use App\Models\Images;

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

    $title = $args['title'];
    $content = $args['content'];
    $cover_id = $args['coverId'];
    $images = array_key_exists('images', $args) ? $args['images'] : [];

    if ($title == '' || $title == 'null') {
      throw new Exception('Title is required');
    }
    if ($content == '' || $content == 'null') {
      throw new Exception('Content is required');
    }
    if ($cover_id == '' || $cover_id == null) {
      throw new Exception('CoverId is required');
    }

    $this->moveImage($args['coverId']);
    $post = Post::create([
      'title' => $args['title'],
      'content' => $args['content'],
      'cover_id' => $args['coverId'],
    ]);
    $post_id = $post->id;

    foreach ($images as $key => $value) {
      $this->moveImage($value);
      PostImage::create([
        'post_id' => $post_id,
        'image_id' => $value,
      ]);
    }
    return ['message' => 'Success'];
  }

  function moveImage($id)
  {
    $imageName = Images::find($id)->name;
    Storage::move('tmp/' . $imageName, 'images_posts/' . $imageName);
  }
}
