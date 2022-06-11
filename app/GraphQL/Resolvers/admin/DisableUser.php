<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class DisableUser
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user() == null) {
      throw new Exception('Unauthorized');
    }

    if (Auth::guard('api')->user()->is_admin == false) {
      throw new Exception('Unauthorized');
    }

    $user_id = $args['id'];
    $user_disabled = $args['user_disabled'];
    $is_user_admin = User::where('id', $user_id)->get()[0]->is_admin;

    if ($is_user_admin) {
      throw new Exception("Can't disable admin");
    }

    try {
      User::where('id', $user_id)->update([
        'is_user_disabled' => $user_disabled,
      ]);
    } catch (Exception $e) {
      throw new Exception($e);
    }
  }
}
