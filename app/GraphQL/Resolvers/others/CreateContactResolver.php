<?php

namespace App\GraphQL\Resolvers\others;

use App\Models\ContactMessage;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Feedbacks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class CreateContactResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        $name = $args["name"];
        $subject = $args["subject"];
        $email = $args["email"];
        $description = $args["description"];

        ContactMessage::create([
          'name'=>$name,
          'subject'=>$subject,
          'email'=>$email,
          'description'=>$description,
        ]);

        Mail::send(
            "emails.emailContact",
            ["name" => $args["name"]],
            function ($message) use ($email) {
                $message->to("contacto@dowar.xyz");
                $message->subject("Confirmación de contacto");
            }
        );
    }
}
