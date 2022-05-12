<?php

namespace App\GraphQL\Resolvers\auth;

use App\Models\Images;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UpdateUserPasswordResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = Auth::guard('api')->user();
    if ($user == null) {
      throw new Exception('Unauthorized');
    }

    $email = $user->email;

    $credentials = [
      'email' => $email,
      'password' => strval($args['oldPassword']),
    ];

    if (!Auth::guard('web')->attempt($credentials, false, false)) {
      throw new Exception('Wrong password');
    }

    if ($args['newPassword'] != $args['newPasswordRepeat']) {
      throw new Exception('Passwords are not the same');
    }

    User::where('email', '=', $email)->update([
      'password' => bcrypt($args['newPassword']),
    ]);

    return ['message' => 'Success'];
  }

  function moveImage($id)
  {
    $imageName = Images::find($id)->name;
    Storage::move('tmp/' . $imageName, 'user_images_profile/' . $imageName);
  }
}
