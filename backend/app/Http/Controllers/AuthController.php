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
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
  public function signup(Request $request)
  {
    $request->validate([
      "name" => "required|string",
      "user" => "required|string",
      "email" => "required|string|email|unique:users",
      "password" => "required|string",
    ]);

    $user = new User([
      "name" => $request->name,
      "user" => $request->user,
      "email" => $request->email,
      "password" => bcrypt($request->password),
    ]);
    $user->save();

    $token = Str::random(64);

    UserVerify::create([
      "user_id" => $user->id,
      "token" => $token,
    ]);

    Mail::send("emails.emailVerificationEmail", ["token" => $token], function (
      $message
    ) use ($request) {
      $message->to($request->email);
      $message->subject("Email Verification Mail");
    });

    return response()->json(
      [
        "message" => "success",
        "user" => $user,
      ],
      201
    );
  }

  public function login(Request $request)
  {
    $request->validate([
      "email" => "required|string|email",
      "password" => "required|string",
      "remember_me" => "boolean",
    ]);
    $credentials = request(["email", "password"]);
    if (!Auth::attempt($credentials)) {
      return response()->json(
        [
          "message" => "Unauthorized",
        ],
        401
      );
    }
    $user = $request->user();
    if ($user->is_email_verified) {
      $tokenResult = $user->createToken("Personal Access Token");
      $token = $tokenResult->token;
      if ($request->remember_me) {
        $token->expires_at = Carbon::now()->addWeeks(1);
      }
      $token->save();
      return response()->json([
        "access_token" => $tokenResult->accessToken,
        "token_type" => "Bearer",
        "expires_at" => Carbon::parse(
          $tokenResult->token->expires_at
        )->toDateTimeString(),
      ]);
    } else {
      return response()->json(
        [
          "message" => "Unverified email",
        ],
        401
      );
    }
  }

  public function logout(Request $request)
  {
    $request->user()->token()->revoke();
    return response()->json(["message" => "Success"]);
  }

  public function user(Request $request)
  {
    return response()->json($request->user());
  }

  public function verifyAccount($token)
  {
    $verifyUser = UserVerify::where("token", $token)->first();

    $message = $token;

    if (!is_null($verifyUser)) {
      $user = $verifyUser->user;

      if (!$user->is_email_verified) {
        $verifyUser->user->is_email_verified = 1;
        $verifyUser->user->save();
        $message =
          "Tu correo electrónico esta verificado. Ya puedes iniciar sesión.";
      } else {
        $message = "Tu correo electrónico ya se encontraba verificado.";
      }
    }

    return $message;
  }

  public function verifyNewEmail(Request $request)
  {
    $email = $request->email;
    $message = "Invalid link";
    $verifyEmail = UserVerify::where("token", $request->token)->first();

    $is_email_selected =
      count(User::where("email", $email)->get()) == 1 ? true : false;
    if ($is_email_selected) {
      throw new Exception($message);
    }

    if (!is_null($verifyEmail)) {
      $user = $verifyEmail->user;
      if ($user->email != $request->email) {
        $verifyEmail->user->email = $request->email;
        $verifyEmail->user->save();
        $message = "Correo electrónico actualizado correctamente.";
      }
    }

    return $message;
  }

  public function searchUser(Request $request)
  {
    $perPage = $request->input("per_page", $request->perpage);
    $users = User::paginate($perPage);
    return response()->json($users);
  }

  public function recoverPassword(Request $request)
  {
    $message_success = "If the email is registered, a reset code will be sent";
    try {
      $email = $request->email;

      if (empty($email)) {
        return response()->json(
          [
            "message" => $message_success,
          ],
          200
        );
      }

      $user = User::where("email", $email)->first();

      if ($user) {
        $code = mt_rand(100000, 999999);

        ResetCodePassword::where("email", $email)->delete();

        $codeData = ResetCodePassword::create([
          "code" => $code,
          "email" => $email,
        ]);

        Mail::send(
          "emails.emailCodeResetPassword",
          ["code" => $codeData->code, "email" => $request->email],
          function ($message) use ($email) {
            $message->to($email);
            $message->subject("Email Verification Mail");
          }
        );
      }

      return response()->json(["message" => $message_success], 200);
    } catch (\Exception $e) {
      return response()->json(
        ["error" => "An error occurred: " . $e->getMessage()],
        500
      );
    }
  }

  public function resetPassword(Request $request)
  {
    $email = $request->email;
    $code = $request->code;

    $validator = Validator::make($request->all(), [
      "email" => "required|email",
      "code" => "required",
      "password" => [
        "required",
        "string",
        "min:8",
        "regex:/[a-z]/",
        "regex:/[A-Z]/",
        "regex:/[0-9]/",
        "regex:/[@$!%*?&]/",
      ],
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
    }

    $result = ResetCodePassword::where("email", "=", $email)
      ->where("code", "=", $code)
      ->get();

    if (sizeof($result) == 0) {
      return response()->json("Code invalid", 400);
    }

    ResetCodePassword::where("email", "=", $email)
      ->where("code", "=", $code)
      ->delete();
    User::where("email", "=", $email)->update([
      "password" => bcrypt($request["password"]),
    ]);
  }
}
