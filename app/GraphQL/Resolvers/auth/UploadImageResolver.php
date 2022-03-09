<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Images;
use Illuminate\Support\Facades\Storage;

class UploadImageResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $file = $args['file'];
    $filename = uniqid() . time() . '.webp';
    $path = $file->storeAs('images_posts', $filename);

    $image = Images::create([
      'name' => $filename,
      'path' => $path,
    ]);
    return [
      'msg' => $args['file'],
      'image' => [
        [
          'source' => base64_encode(
            Storage::disk('images_posts')->get($image['name'])
          ),
          'id' => $image->id,
          'path' => $image->path,
          'name' => $image->name,
        ],
      ],
    ];
  }
}
