<?php

namespace App\GraphQL\Resolvers\others;

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
    $file = $args['file'];
    $filename = uniqid() . time() . '.webp';
    $path = '/tmp/' . $filename;
    @list($type, $file_data) = explode(';', $file);
    @list(, $file_data) = explode(',', $file_data);
    Storage::disk('tmp')->put($filename, base64_decode($file_data));

    if ($file == '' || $file == 'null') {
      throw new Exception('File is required');
    }

    $image = Images::create([
      'name' => $filename,
      'path' => $path,
    ]);
    return [
      'message' => 'Success',
      'image' => [
        'source' => base64_encode(Storage::disk('tmp')->get($filename)),
        'id' => $image->id,
        'path' => $image->path,
        'name' => $image->name,
      ],
    ];
  }
}
