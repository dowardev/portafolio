<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class GetImageResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $image = DB::table('images')
      ->where('name', '=', $args['name'])
      ->get();

    return [
      'message' => 'Success',
      'image' => [
        [
          'source' => base64_encode(
            Storage::disk('images_posts')->get($args['name'])
          ),
          'path' => $image[0]->path,
          'name' => $image[0]->name,
        ],
      ],
    ];
  }
}
