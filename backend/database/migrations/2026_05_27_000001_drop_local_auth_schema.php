<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('personal_access_tokens');

        Schema::table('feedbacks', function ($table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('users', function ($table) {
            $table->dropForeign(['image_id']);
        });

        Schema::dropIfExists('users');
    }

    public function down()
    {
        // No need to recreate local auth schema - SSO handles everything
    }
};
