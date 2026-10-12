<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->enum('category', ['upcoming', 'top_rated', 'series'])->index();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('quality', 10)->nullable();            // HD, 2K, 4K ...
            $table->unsignedSmallInteger('runtime_minutes')->nullable();
            $table->unsignedSmallInteger('episodes')->nullable(); // series only
            $table->decimal('rating', 3, 1)->nullable();
            $table->string('genre')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('poster');                              // '/assets/movies/..' (frontend) or 'posters/..' (uploaded)
            $table->string('backdrop')->nullable();
            $table->string('trailer_url')->nullable();             // YouTube link (replaces the old TRAILER.mp4 files)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
