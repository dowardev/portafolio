<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
}
