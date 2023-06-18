<?php

namespace App\GraphQL\Resolvers\post;

use App\Models\Post;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;

class SearchPostsResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        $search = $args["search"];
        $query = Post::select("id", "title")
            ->where("title", "like", "%" . $search . "%")
            ->get();

        return $query;
    }
}
