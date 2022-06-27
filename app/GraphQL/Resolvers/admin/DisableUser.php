<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

class DisableUser
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user() == null) {
      return Error::createLocatedError('Unauthorized');
    }

    if (Auth::guard('api')->user()->is_admin == false) {
      return Error::createLocatedError('Unauthorized');
    }

    $user_id = $args['id'];
    $user_disabled = $args['user_disabled'];
    $is_user_admin = User::where('id', $user_id)->get()[0]->is_admin;

    if ($is_user_admin) {
      return Error::createLocatedError("Can't disable admin");
    }

    try {
      User::where('id', $user_id)->update([
        'is_user_disabled' => $user_disabled,
      ]);
    } catch (Exception $e) {
      return Error::createLocatedError($e);
    }
  }
}
