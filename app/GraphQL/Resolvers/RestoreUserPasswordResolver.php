<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\ResetCodePassword;
use App\Models\User;

class RestoreUserPasswordResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $email = $args['email'];
    $code = $args['code'];
    $password = $args['password'];

    $result = ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->get();

    if (sizeof($result) == 0) {
      return ['msg' => 'Code invalid'];
    }
    ResetCodePassword::where('email', '=', $email)
      ->where('code', '=', $code)
      ->delete();
    User::where('email', '=', $email)->update([
      'password' => bcrypt($args['password']),
    ]);
    return ['msg' => 'Success'];
  }
}
