<?php

namespace App\GraphQL\Resolvers\others;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Images;
use Illuminate\Support\Facades\Storage;
use GraphQL\Error\Error;

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
      return Error::createLocatedError('File is required');
    }

    $image = Images::create([
      'name' => $filename,
      'path' => $path,
    ]);
    return [
        'id' => $image->id,
        'path' => $image->path,
    ];
  }
}
