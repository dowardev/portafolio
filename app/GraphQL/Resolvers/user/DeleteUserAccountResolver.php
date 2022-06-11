<?php

namespace App\GraphQL\Resolvers\user;

use App\Models\Images;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\UserVerify;
use Illuminate\Support\Facades\Storage;

class DeleteUserAccountResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = Auth::guard('api')->user();

    $email = $user->email;

    $credentials = [
      'email' => $email,
      'password' => strval($args['password']),
    ];

    if (!Auth::guard('web')->attempt($credentials)) {
      throw new Exception('Wrong password');
    }

    User::find($user->id)->delete();
  }
}
