<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
  public function getUsers(Request $request)
  {
    $search = $request->query("search", "");
    $pagination = $request->query("pagination", 10);
    $options = json_decode($request->query("options", "{}"), true);
    $options = $this->transformOptions($options);
    Log::info("Options:", $options);
    $loggedInUserId = auth()->user()->id;

    $query = User::where("id", "!=", $loggedInUserId);

    if (!empty($search)) {
      $query->where(function ($q) use ($search) {
        $q->where("name", "like", "%" . $search . "%")
          ->orWhere("email", "like", "%" . $search . "%")
          ->orWhere("user", "like", "%" . $search . "%");
      });
    }

    if (!empty($options)) {
      foreach ($options as $field => $value) {
        if (!empty($value)) {
          switch ($field) {
            case "email":
              $query->where("is_email_verified", $value);
              break;

            case "user":
              $query->where("is_user_disabled", $value);
              break;

            case "admin":
              $query->where("is_admin", $value);
              break;
          }
        }
      }
    }

    $users = $query->paginate($pagination);
    return response()->json($users);
  }

  function transformOptions($options)
  {
    $options = array_filter($options, function ($value) {
      return $value !== "all";
    });

    if (isset($options["rol"]) && $options["rol"] === "admin") {
      $options["admin"] = true;
      unset($options["rol"]);
    }

    if (isset($options["user"])) {
      if ($options["user"] === "disabled") {
        $options["user"] = true;
      } elseif ($options["user"] === "enabled") {
        $options["user"] = false;
      }
    }

    if (isset($options["email"])) {
      if ($options["email"] === "verified") {
        $options["email"] = true;
      } elseif ($options["email"] === "unverified") {
        $options["email"] = false;
      }
    }

    return $options;
  }

  function updateUserStatus(Request $request)
  {
    $request->validate([
      "userId" => "required|exists:users,id",
      "status" => "required|boolean",
    ]);

    try {
      $user = User::find($request->input("userId"));
      $user->is_user_disabled = $request->input("status");
      $user->save();

      return response()->json([
        "message" => "User status updated successfully",
      ]);
    } catch (\Exception $e) {
      return response()->json(
        [
          "error" => "Operation failed",
          "message" => $e->getMessage(),
        ],
        500
      );
    }
  }

  function adminDeleteUser(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "id" => "nullable|integer|exists:users,id",
      "email" => "nullable|email|exists:users,email",
    ]);

    if ($validator->fails()) {
      return response()->json(["error" => $validator->errors()], 400);
    }

    $id = $request->input("id");
    $email = $request->input("email");

    if ($id) {
      $user = User::find($id);
    } elseif ($email) {
      $user = User::where("email", $email)->first();
    } else {
      return response()->json(["error" => "No id or email provided"], 400);
    }

    if ($user) {
      $user->delete();
      return response()->json(["success" => "User deleted successfully"]);
    } else {
      return response()->json(["error" => "User not found"], 404);
    }
  }
}
