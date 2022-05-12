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
  public function sendCodeResetPassword(Request $request)
  {
    try {
      $data = $request->validate([
        'email' => 'required|email|exists:users',
      ]);
    } catch (\Throwable $th) {
      return response()->json(['message' => 'Success'], 200);
    }

    ResetCodePassword::where('email', $request->email)->delete();

    $data['code'] = mt_rand(100000, 999999);

    $codeData = ResetCodePassword::create($data);

    Mail::send(
      'emails.emailCodeResetPassword',
      ['code' => $codeData->code],
      function ($message) use ($request) {
        $message->to($request->email);
        $message->subject('Email Verification Mail');
      }
    );

    return response()->json(['message' => 'Success'], 200);
  }

  function verifyCodeResetPassword(Request $request)
  {
    $email = $request->email;
    $code = $request->code;
    try {
      $result = ResetCodePassword::where('email', '=', $email)
        ->where('code', '=', $code)
        ->get();
      if (sizeof($result) > 0) {
        return response()->json(['message' => 'Code valid'], 200);
      } else {
        throw new Exception('Code invalid');
      }
    } catch (Exception $e) {
      throw new Exception($e->getMessage());
    }
  }

  function resetPassword(Request $request)
  {
    ResetCodePassword::where('email', $request->email)->delete();
    return User::where('email', '=', $request->email)->update([
      'password' => bcrypt($request->password),
    ]);
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
