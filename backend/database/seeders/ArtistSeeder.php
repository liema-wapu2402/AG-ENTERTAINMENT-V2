<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Artists listed on the old MUSIC.html page (spelling fixed).
 * Songs are NOT seeded - they come from real mp3 files via `php artisan music:import`.
 */
class ArtistSeeder extends Seeder
{
    public function run(): void
    {
        $artists = [
            'female' => ['Adele', 'Billie Eilish', 'Doja Cat', 'Taylor Swift', 'Katy Perry', 'Anne-Marie', 'Ariana Grande', 'Nicki Minaj'],
            'male' => ['Boy With Uke', 'Jason Derulo', 'Charlie Puth', 'Bruno Mars', 'Justin Bieber', 'Sam Smith', 'Khalid', 'Shawn Mendes'],
        ];

        foreach ($artists as $gender => $names) {
            foreach ($names as $name) {
                Artist::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'gender' => $gender]);
            }
        }
    }
}
