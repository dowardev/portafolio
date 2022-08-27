<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("users", function (Blueprint $table) {
            $table->boolean("is_user_disabled")->default(false);
        });

        DB::table("users")->insert([
            "name" => "Admin",
            "user" => "admin",
            "email" => "admin@admin.com",
            "image_id" => null,
            "is_email_verified" => true,
            "password" => bcrypt("d2f%PF"),
            "is_admin" => true,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("users", function (Blueprint $table) {
            //
        });
    }
};
