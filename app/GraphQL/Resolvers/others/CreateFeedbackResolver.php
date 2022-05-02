<?php

namespace App\GraphQL\Resolvers\others;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Feedbacks;
use Illuminate\Support\Facades\Auth;

class CreateFeedbackResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    $user = Auth::guard('api')->user();
    $user_id = null;

    $name = $args['name'];
    $email = $args['email'];
    $description = $args['description'];
    $contact_me = $args['contact_me'];
    $type = $args['type'];

    if ($user != null) {
      $user_id = $user->id;
      $name = '';
      $email = '';
    }

    Feedbacks::create([
      'user_id' => $user_id,
      'name' => $name,
      'email' => $email,
      'description' => $description,
      'contact_me' => $contact_me,
      'type' => $type,
    ]);

    return ['message' => 'Success'];
  }
}
