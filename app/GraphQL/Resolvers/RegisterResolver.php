<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserVerify;
use Illuminate\Support\Facades\Mail;
use Exception;

class RegisterResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (count(User::where('user', '=', $args['user'])->get())) {
      throw new Exception('The user has already been selected');
    }
    if (count(User::where('email', '=', $args['email'])->get())) {
      throw new Exception('The email has already been selected');
    }

    $user = new User([
      'name' => $args['name'],
      'user' => $args['user'],
      'email' => $args['email'],
      'password' => bcrypt($args['password']),
    ]);
    $user->save();

    $token = Str::random(64);
    UserVerify::create([
      'user_id' => $user->id,
      'token' => $token,
    ]);

    Mail::send('emails.emailVerificationEmail', ['token' => $token], function (
      $message
    ) use ($args) {
      $message->to($args['email']);
      $message->subject('Email Verification Mail');
    });
    return ['msg' => 'Success'];
  }
}
