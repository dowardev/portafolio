<?php

namespace App\GraphQL\Resolvers\post;

use DateTime;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;
use GraphQL\Error\Error;

class GetPostsResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        $date = (new DateTime($args["date"]))->format("Y-m-d");

        try {
            $result = DB::table("posts")
                ->join("images", "cover_id", "=", "images.id")
                ->select(
                    "posts.id as post_id",
                    "posts.title as post_title",
                    "posts.content as post_content",
                    "posts.created_at as post_created_at",
                    "posts.updated_at as post_updated_at",
                    "images.id as image_id",
                    "images.name as image_name",
                    "images.path as image_path"
                )
                ->whereDate("posts.created_at", $date)
                ->get();

            if ($result == null) {
                return Error::createLocatedError("No posts");
            }
        } catch (Exception $e) {
            return Error::createLocatedError($e->getMessage());
        }

        $posts = [];
        foreach ($result as $key => $value) {
            $post = [
                "id" => $value->post_id,
                "title" => $value->post_title,
                "content" => $value->post_content,
                "created_at" => (new DateTime($value->post_created_at))->format(
                    DateTime::ATOM
                ),
                "updated_at" => $value->post_updated_at,
                "cover" => [
                    "id" => $value->image_id,
                    "name" => $value->image_name,
                    "path" => $value->image_path,
                    "source" => base64_encode(
                        Storage::disk("images_posts")->get($value->image_name)
                    ),
                ],
            ];
            array_push($posts, $post);
        }
        return ["posts" => $posts];
    }
}
