<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use DateTime;
use Exception;

class RecentPostsDateResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
try {
$postDates = Post::select('created_at')
      ->groupBy('created_at')
      ->get()
      ->first();

    if($postDates==null)throw new Exception('No dates');
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
    

    return [
      'message' => 'success',
      'date' => explode('+', $postDates->created_at->format(DateTime::ATOM))[0],
    ];
  }
}
