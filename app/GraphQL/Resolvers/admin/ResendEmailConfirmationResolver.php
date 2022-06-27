<?php

namespace App\GraphQL\Resolvers\user;

use App\Models\User;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use GraphQL\Error\Error;

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
      return Error::createLocatedError('User already verified');
    }

    $token = Str::random(64);

    Mail::send('emails.emailVerificationEmail', ['token' => $token], function (
      $message
    ) use ($email) {
      $message->to($email);
      $message->subject('Verificacion de correo electrónico');
    });
  }
}
