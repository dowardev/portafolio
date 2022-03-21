<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Images;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;

class UploadImageResolver
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
    $file = $args['file'];
    $filename = uniqid() . time() . '.webp';
    $path = $file->storeAs('tmp', $filename);

    $image = Images::create([
      'name' => $filename,
      'path' => $path,
    ]);
    return [
      'message' => $args['file'],
      'image' => [
        [
          'source' => base64_encode(Storage::disk('tmp')->get($image['name'])),
          'id' => $image->id,
          'path' => $image->path,
          'name' => $image->name,
        ],
      ],
    ];
  }
}
