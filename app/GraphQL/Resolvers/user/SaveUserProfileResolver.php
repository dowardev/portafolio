<?php

namespace App\GraphQL\Resolvers\user;

use App\Models\Images;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\UserVerify;
use Illuminate\Support\Facades\Storage;
use GraphQL\Error\Error;

class SaveUserProfileResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        $user = Auth::guard("api")->user();
        if ($user == null) {
            return Error::createLocatedError("Unauthorized");
        }

        $name = array_key_exists("name", $args) ? $args["name"] : "";
        $user_name = array_key_exists("user", $args) ? $args["user"] : "";
        $email = array_key_exists("email", $args) ? $args["email"] : "";
        $image_id = array_key_exists("image_id", $args)
            ? $args["image_id"]
            : "";
        $queryUser = User::where("id", $user->id);

        if ($name != "") {
            $queryUser->update([
                "name" => $name,
            ]);
        }

        if ($user_name != "") {
            $queryUser->update([
                "user" => $user_name,
            ]);
        }

        if ($image_id != "") {
            $this->moveImage($image_id);
            $queryUser->update([
                "image_id" => $image_id,
            ]);
        }

        $token = Str::random(64);
        UserVerify::create([
            "user_id" => $user->id,
            "token" => $token,
        ]);

        if ($email != "" && $user->email != $email) {
            Mail::send(
                "emails.emailVerificationNewEmail",
                ["token" => $token, "email" => $email],
                function ($message) use ($email) {
                    $message->to($email);
                    $message->subject(
                        "Verificacion de nuevo correo electrónico"
                    );
                }
            );
        }
    }

    function moveImage($id)
    {
        $imageName = Images::find($id)->name;
        Storage::move("tmp/" . $imageName, "user_images_profile/" . $imageName);
    }
}
