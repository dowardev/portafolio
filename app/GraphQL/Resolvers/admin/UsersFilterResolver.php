<?php

namespace App\GraphQL\Resolvers\admin;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Type\Definition\ResolveInfo;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\DB;

class UsersFilterResolver
{
  public function resolve(
    $rootValue,
    array $args,
    GraphQLContext $context = null,
    ResolveInfo $resolveInfo
  ) {
    if (Auth::guard('api')->user() == null) {
      return Error::createLocatedError('Unauthorized');
    }

    if (Auth::guard('api')->user()->is_admin == false) {
      return Error::createLocatedError('Unauthorized');
    }

    $filterOptions = json_decode($args['filterOptions']);
    $is_filter_enabled = in_array('unfiltered', $filterOptions);

    $search = array_key_exists('search', $args) ? $args['search'] : null;

    $admin_filter_option =
      in_array('admin', $filterOptions) == true ? true : false;
    $no_admin_filter_option =
      in_array('no admin', $filterOptions) == true ? true : false;

    $enabled_filter_option =
      in_array('enabled', $filterOptions) == true ? true : false;
    $disabled_filter_option =
      in_array('disabled', $filterOptions) == true ? true : false;

    $verified_filter_option =
      in_array('verified', $filterOptions) == true ? true : false;
    $no_verified_filter_option =
      in_array('no verified', $filterOptions) == true ? true : false;

    $query = User::query();

    if ($search != null) {
      $query->where('email', 'like', '%' . $search . '%');
    }

    if ($is_filter_enabled == false && $admin_filter_option == true) {
      $query->where('is_admin', 1);
    }
    if ($is_filter_enabled == false && $no_admin_filter_option == true) {
      $query->where('is_admin', 0);
    }

    if ($is_filter_enabled == false && $enabled_filter_option == true) {
      $query->where('is_user_disabled', 0);
    }
    if ($is_filter_enabled == false && $disabled_filter_option == true) {
      $query->where('is_user_disabled', 1);
    }

    if ($verified_filter_option == false && $verified_filter_option == true) {
      $query->where('is_email_verified', 1);
    }
    if (
      $verified_filter_option == false &&
      $no_verified_filter_option == true
    ) {
      $query->where('is_email_verified', 0);
    }
    return $query;
  }
}
