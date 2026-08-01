<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign('posts_cover_id_foreign');

            $table->integer('cover_id')->unsigned()->nullable()->change();

            $table
                ->foreign('cover_id')
                ->references('id')
                ->on('images')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Eliminar la clave foránea modificada
            $table->dropForeign('posts_cover_id_foreign');

            // Revertir 'cover_id' a no nullable si es necesario
            $table->integer('cover_id')->unsigned()->nullable(false)->change();

            // Restaurar la clave foránea original con 'onDelete' cascade
            $table
                ->foreign('cover_id')
                ->references('id')
                ->on('images')
                ->onDelete('cascade');
        });
    }
};
