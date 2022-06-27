<?php

namespace App\GraphQL\Resolvers\auth;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserVerify;
use Illuminate\Support\Facades\Mail;
use GraphQL\Error\Error;

class RegisterResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $name = $args['name'];
    $user = $args['user'];
    $email = $args['email'];
    $password = $args['password'];

    if ($name == '' || $name == 'null') {
      return Error::createLocatedError('Name is required');
    }
    if ($user == '' || $user == 'null') {
      return Error::createLocatedError('User is required');
    }
    if ($email == '' || $email == 'null') {
      return Error::createLocatedError('Email is required');
    }
    if ($password == '' || $password == 'null') {
      return Error::createLocatedError('Password is required');
    }
    if (count(User::where('user', '=', $user)->get())) {
      return Error::createLocatedError('The user has already been selected');
    }
    if (count(User::where('email', '=', $email)->get())) {
      return Error::createLocatedError('The email has already been selected');
    }

    $newUser = new User([
      'name' => $name,
      'user' => $user,
      'email' => $email,
      'password' => bcrypt($args['password']),
    ]);
    $newUser->save();

    $token = Str::random(64);
    UserVerify::create([
      'user_id' => $newUser->id,
      'token' => $token,
    ]);

    Mail::send('emails.emailVerificationEmail', ['token' => $token], function (
      $message
    ) use ($args) {
      $message->to($args['email']);
      $message->subject('Verificacion de correo electrónico');
    });
  }
}
