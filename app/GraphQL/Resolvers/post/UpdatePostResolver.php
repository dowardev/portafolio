<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Images;
use App\Models\PostImage;
use Illuminate\Support\Facades\Auth;
use Exception;

class UpdatePostResolver
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
    $title = $args['title'];
    $content = $args['content'];
    $cover_id = intval($args['coverId']);

    $new_cover_id = array_key_exists('newCoverId', $args)
      ? $args['newCoverId']
      : '';

    $new_images = array_key_exists('images', $args) ? $args['images'] : [];

    $images_removed = array_key_exists('imagesRemoved', $args)
      ? $args['imagesRemoved']
      : [];

    if ($title == '' || $title == 'null') {
      throw new Exception('Title is required');
    }
    if ($content == '' || $content == 'null') {
      throw new Exception('Content is required');
    }

    Post::where('id', '=', $id)->update([
      'title' => $title,
      'content' => $content,
    ]);

    if ($new_cover_id != '') {
      $cover_name = Images::where('id', '=', $cover_id)->get()[0]->name;
      Post::where('id', '=', $id)->update([
        'cover_id' => $new_cover_id,
      ]);
      Storage::delete('images_posts/' . $cover_name);
      Images::where('id', '=', $cover_id)->delete();
      $this->moveImage($new_cover_id);
    }

    foreach ($images_removed as $key => $value) {
      Storage::delete('images_posts/' . $value);
      Images::where('name', '=', $value)->delete();
    }

    foreach ($new_images as $key => $value) {
      $this->moveImage($value);
      PostImage::create([
        'image_id' => $value,
        'post_id' => $id,
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
