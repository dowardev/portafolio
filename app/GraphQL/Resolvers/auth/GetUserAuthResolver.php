<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Exception;
use Error;

class GetUserAuthResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    try {
      $user = Auth::guard('api')->user();
      if ($user == null) {
        throw new Exception('Unauthorized');
      }
      return [
        'message' => 'Success',
        'user' => $user,
      ];
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
    return [
      'message' => 'Unauthorized',
    ];
  }
}
