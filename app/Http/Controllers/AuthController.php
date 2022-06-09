<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserVerify;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\ResetCodePassword;
use Exception;

class AuthController extends Controller
{
  public function signup(Request $request)
  {
    $request->validate([
      'name' => 'required|string',
      'user' => 'required|string',
      'email' => 'required|string|email|unique:users',
      'password' => 'required|string',
    ]);
    $user = new User([
      'name' => $request->name,
      'user' => $request->user,
      'email' => $request->email,
      'password' => bcrypt($request->password),
    ]);
    $user->save();

    $token = Str::random(64);
    UserVerify::create([
      'user_id' => $user->id,
      'token' => $token,
    ]);

    Mail::send('emails.emailVerificationEmail', ['token' => $token], function (
      $message
    ) use ($request) {
      $message->to($request->email);
      $message->subject('Email Verification Mail');
    });

    return response()->json(
      [
        'message' => 'Successfully created user!',
      ],
      201
    );
  }
  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string',
      'remember_me' => 'boolean',
    ]);
    $credentials = request(['email', 'password']);
    if (!Auth::attempt($credentials)) {
      return response()->json(
        [
          'message' => 'Unauthorized',
        ],
        401
      );
    }
    $user = $request->user();
    if ($user->is_email_verified) {
      $tokenResult = $user->createToken('Personal Access Token');
      $token = $tokenResult->token;
      if ($request->remember_me) {
        $token->expires_at = Carbon::now()->addWeeks(1);
      }
      $token->save();
      return response()->json([
        'access_token' => $tokenResult->accessToken,
        'token_type' => 'Bearer',
        'expires_at' => Carbon::parse(
          $tokenResult->token->expires_at
        )->toDateTimeString(),
      ]);
    } else {
      return response()->json(
        [
          'message' => 'Unverified email',
        ],
        401
      );
    }
  }

  public function logout(Request $request)
  {
    $request
      ->user()
      ->token()
      ->revoke();
    return response()->json(['message' => 'Success']);
  }

  public function user(Request $request)
  {
    return response()->json($request->user());
  }

  public function verifyAccount($token)
  {
    $verifyUser = UserVerify::where('token', $token)->first();

    $message = 'Tu correo electrónico no puede ser identificado.';

    if (!is_null($verifyUser)) {
      $user = $verifyUser->user;

      if (!$user->is_email_verified) {
        $verifyUser->user->is_email_verified = 1;
        $verifyUser->user->save();
        $message =
          'Tu correo electrónico esta verificado. Ya puedes iniciar sesión.';
      } else {
        $message = 'Tu correo electrónico ya se encontraba verificado.';
      }
    }

    return $message;
  }

  public function verifyNewEmail(Request $request)
  {
    $verifyEmail = UserVerify::where('token', $request->token)->first();

    $message = 'Enlace invalido';

    if (!is_null($verifyEmail)) {
      $user = $verifyEmail->user;
      if ($user->email != $request->email) {
        $verifyEmail->user->email = $request->email;
        $verifyEmail->user->save();
        $message = 'Correo electrónico actualizado correctamente.';
      }
    }

    return $message;
  }
}
