<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserVerify;
use Illuminate\Support\Facades\Mail;

class RegisterResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    try {
      $user = new User([
        'name' => $args['name'],
        'user' => $args['user'],
        'email' => $args['email'],
        'password' => bcrypt($args['password']),
      ]);
      $user->save();
    } catch (\Illuminate\Database\QueryException $ex) {
      if ($ex->getCode() == '23000') {
        return ['msg' => 'Mail selected'];
      }
    }
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
