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
    $identifier = '';
    if (array_key_exists('name', $args) && $args['name'] != '') {
      $identifier = $args['name'];
    } else {
      $identifier = $args['id'];
    }

    $image = DB::table('images')
      ->where('id', '=', $identifier)
      ->orWhere('name', '=', $identifier)
      ->get();

    return [
      'message' => 'Success',
      'image' => [
        [
          'source' => base64_encode(
            Storage::disk('images_posts')->get($image[0]->name)
          ),
          'id' => $image[0]->id,
          'path' => $image[0]->path,
          'name' => $image[0]->name,
        ],
      ],
    ];
  }
}
