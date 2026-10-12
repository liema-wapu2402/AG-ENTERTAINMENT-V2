<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Books module: genres + books.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_genres', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('icon')->default('wand');  // key used by the React icon map
            $table->string('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('genre_id')->constrained('book_genres')->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('author');
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedSmallInteger('pages')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('cover_path')->nullable(); // optional uploaded cover
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
        Schema::dropIfExists('book_genres');
    }
};
