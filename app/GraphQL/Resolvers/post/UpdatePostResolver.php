<?php

namespace App\GraphQL\Resolvers\post;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Images;
use App\Models\PostImage;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

class UpdatePostResolver
{
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context = null,
        ResolveInfo $resolveInfo
    ) {
        if (Auth::guard("api")->user()->is_admin == false) {
            return Error::createLocatedError("Unauthorized");
        }

        $id = intval($args["id"]);
        $title = $args["title"];
        $content = $args["content"];
        $cover_id = intval($args["coverId"]);

        $new_cover_id = array_key_exists("newCoverId", $args)
            ? $args["newCoverId"]
            : "";

        $new_images = array_key_exists("images", $args) ? $args["images"] : [];

        $images_removed = array_key_exists("imagesRemoved", $args)
            ? $args["imagesRemoved"]
            : [];

        if ($title == "" || $title == "null") {
            return Error::createLocatedError("Title is required");
        }
        if ($content == "" || $content == "null") {
            return Error::createLocatedError("Content is required");
        }

        Post::where("id", "=", $id)->update([
            "title" => $title,
            "content" => $content,
        ]);

        if ($new_cover_id != "") {
            try {
                $cover = Images::find($cover_id);
                $cover_name = $cover->name;
                $post = Post::find($id);
                $post->update([
                    'cover_id' => $new_cover_id
                ]);
                Storage::delete("images_posts/" . $cover_name);
                Images::destroy($cover_id);
                $this->moveImage($new_cover_id);
            } catch (\Throwable $th) {
                return Error::createLocatedError($e);
            }
        }

        foreach ($images_removed as $key => $value) {
            Storage::delete("images_posts/" . $value);
            Images::where("name", "=", $value)->delete();
        }

        foreach ($new_images as $key => $value) {
            $this->moveImage($value);
            PostImage::create([
                "image_id" => $value,
                "post_id" => $id,
            ]);
        }
    }

    public function moveImage($id)
    {
        $image=Images::find($id);
        $imageName = $image->name;
        $image->path='/images_posts/'.$imageName;
        $image->save();
        Storage::move('tmp/' . $imageName, 'images_posts/' . $imageName);
    }
}
