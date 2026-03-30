<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('users_verify');
        Schema::dropIfExists('reset_code_passwords');
    }

    public function down(): void
    {
        Schema::create('users_verify', function ($table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('token');
            $table->timestamps();
            
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });

        Schema::create('reset_code_passwords', function ($table) {
            $table->bigIncrements('id');
            $table->string('email')->index();
            $table->integer('code');
            $table->timestamps();
        });
    }
};
