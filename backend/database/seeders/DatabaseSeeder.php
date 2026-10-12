<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /** php artisan db:seed  -> fills movies, artists and books. */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            MovieSeeder::class,
            ArtistSeeder::class,
            BookSeeder::class,
        ]);
    }
}
