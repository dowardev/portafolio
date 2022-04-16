<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use DateTime;

class PostsDatesResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $postDates = Post::select('created_at')
      ->groupBy('created_at')
      ->get();

    $dates = [];
    foreach ($postDates as $key => $value) {
      $date = $value->created_at;
      array_push($dates, explode('+', $date->format(DateTime::ATOM))[0]);
    }

    return ['message' => 'Success', 'dates' => $dates];

    // $dates = [];
    // $date = date_create(explode(' ', $args['date'])[0])->format('y-m-d');
    // $totalDates = count($postDates);
    // $status = true;
    //
    // foreach ($postDates as $key => $value) {
    //   $count = 0;
    //   $postDate = date_create($value->created_at)->format('y-m-d');
    //   if ($postDate > $date && $args['option'] == 'new') {
    //     array_push($dates, $postDate);
    //     if ($value->created_at == $postDates[$totalDates - 1]->created_at) {
    //       $status = false;
    //     }
    //     $count++;
    //   }
    //   if ($postDate < $date && $args['option'] == 'old') {
    //     array_push($dates, $postDate);
    //     if ($value->created_at == $postDates[0]->created_at) {
    //       $status = false;
    //     }
    //     $count++;
    //   } else {
    //     $status = false;
    //   }
    //   if ($count == 4) {
    //     break;
    //   }
    // }
    //
    // return [
    //   'message' => 'success',
    //   'dates' => array_unique($dates),
    //   'status' => $status,
    // ];
  }
}
