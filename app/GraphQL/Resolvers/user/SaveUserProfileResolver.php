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

class SaveUserProfileResolver
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

    if ($args['imageId'] != '') {
      $this->moveImage($args['imageId']);
      User::where('id', $user->id)->update([
        'image_id' => $args['imageId'],
      ]);
    }

    User::where('id', $user->id)->update([
      'name' => $args['name'],
      'user' => $args['user'],
    ]);

    $token = Str::random(64);
    UserVerify::create([
      'user_id' => $user->id,
      'token' => $token,
    ]);

    if ($user->email != $args['email']) {
      Mail::send(
        'emails.emailVerificationNewEmail',
        ['token' => $token, 'email' => $args['email']],
        function ($message) use ($args) {
          $message->to($args['email']);
          $message->subject('Verificacion de nuevo correo electrónico');
        }
      );
    }

    return ['message' => 'Success'];
  }

  function moveImage($id)
  {
    $imageName = Images::find($id)->name;
    Storage::move('tmp/' . $imageName, 'user_images_profile/' . $imageName);
  }
}
