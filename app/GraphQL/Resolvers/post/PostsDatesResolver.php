<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\Post;
use DateTime;

class PostsDatesResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        $postDates = Post::select("created_at")
            ->orderBy("created_at", "desc")
            ->get();

        $dates = [];
        foreach ($postDates as $key => $value) {
            $date = $value->created_at;
            array_push($dates, explode("+", $date->format(DateTime::ATOM))[0]);
        }

        $group = [];
        foreach ($dates as $key => $value) {
            $date = date("Y-m-d", strtotime($value));
            if (array_search($date, $group, true) == false) {
                array_push($group, $date);
            }
        }
        $dates = $group;

        return ["dates" => $dates];
    }
}
