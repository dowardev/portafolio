<?php

namespace App\GraphQL\Resolvers\user;

use App\Models\User;
use Exception;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ResendEmailConfirmationResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $email = $args['email'];

    $email_verified = User::where('email', $email)->get()[0]->is_email_verified;
    if ($email_verified) {
      throw new Exception('User already verified');
    }

    $user_id = User::where('email', $email)->get()[0]->id;
    $token = User::find($user_id)->tokenEmailValidation->token;

    // $token = Str::random(64);

    Mail::send('emails.emailVerificationEmail', ['token' => $token], function (
      $message
    ) use ($email) {
      $message->to($email);
      $message->subject('Verificacion de correo electrónico');
    });
  }
}
