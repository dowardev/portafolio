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

    $name = $args['name'];
    $userName = $args['user'];
    $email = $args['email'];
    $image_id = $args['imageId'];

    if ($image_id != '') {
      $this->moveImage($image_id);
      User::where('id', $user->id)->update([
        'image_id' => $image_id,
      ]);
    }

    User::where('id', $user->id)->update([
      'name' => $name,
      'user' => $userName,
    ]);

    $token = Str::random(64);
    UserVerify::create([
      'user_id' => $user->id,
      'token' => $token,
    ]);

    $is_email_selected =
      count(User::where('email', $email)->get()) == 1 ? true : false;
    if ($is_email_selected) {
      throw new Exception('Email already selected');
    }

    if ($user->email != $email) {
      Mail::send(
        'emails.emailVerificationNewEmail',
        ['token' => $token, 'email' => $args['email']],
        function ($message) use ($args) {
          $message->to($args['email']);
          $message->subject('Verificacion de nuevo correo electrónico');
        }
      );
    }
  }

  function moveImage($id)
  {
    $imageName = Images::find($id)->name;
    Storage::move('tmp/' . $imageName, 'user_images_profile/' . $imageName);
  }
}
