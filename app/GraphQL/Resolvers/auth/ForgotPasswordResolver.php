<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Mail;
use App\Models\ResetCodePassword;
use App\Models\User;
use GraphQL\Error\Error;

class ForgotPasswordResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $email = $args['email'];

    if ($email == '' || $email == 'null') {
      return Error::createLocatedError('Email is required');
    }
    $user = User::where('email', '=', $email)->get();

    $email = $user[0]->email;
    $code = mt_rand(100000, 999999);

    if (count($user)) {
      ResetCodePassword::where('email', $email)->delete();

      $codeData = ResetCodePassword::create([
        'code' => $code,
        'email' => $email,
      ]);

      Mail::send(
        'emails.emailCodeResetPassword',
        ['code' => $codeData->code, 'email' => $args['email']],
        function ($message) use ($email) {
          $message->to($email);
          $message->subject('Email Verification Mail');
        }
      );
    }
  }
}
