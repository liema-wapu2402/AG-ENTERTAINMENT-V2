<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

/**
 * Movies + TV series from the old site (same posters, years, qualities and ratings).
 * Posters live in the React app: frontend/public/assets/movies/<slug>.<ext>
 */
class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $trailers = require __DIR__.'/data/trailers.php';

        // [slug, title, category, year, quality, runtime, episodes, rating, genre, poster file, synopsis]
        $rows = [
            // ---------------- UPCOMING ----------------
            ['aquaman-lost-kingdom', 'Aquaman and the Lost Kingdom', 'upcoming', 2023, 'HD', 137, null, 8.5, 'Action / Fantasy', 'aquaman-lost-kingdom.webp',
                'Black Manta wields the mythic Black Trident to unleash an ancient evil. Aquaman must ally with his imprisoned brother Orm to save Atlantis and his family.'],
            ['doctor-strange-multiverse', 'Doctor Strange in the Multiverse of Madness', 'upcoming', 2022, '4K', 126, null, null, 'Action / Fantasy', 'doctor-strange-multiverse.png',
                'Doctor Strange teams up with America Chavez to face a threat that tears through the multiverse.'],
            ['guardians-vol-3', 'Guardians of the Galaxy Vol. 3', 'upcoming', 2023, '2K', null, null, null, 'Action / Sci-Fi', 'guardians-vol-3.jpg',
                'The Guardians band together once more for a mission tied to Rocket\'s past.'],
            ['ant-man-quantumania', 'Ant-Man and the Wasp: Quantumania', 'upcoming', 2023, '4K', 107, null, null, 'Action / Sci-Fi', 'ant-man-quantumania.jpeg',
                'Scott Lang, Hope and their family are pulled into the Quantum Realm and come face to face with Kang.'],
            ['meg-2-the-trench', 'Meg 2: The Trench', 'upcoming', 2023, '4K', 107, null, 9.2, 'Action / Thriller', 'meg-2-the-trench.jpg',
                'A research team on a deep-sea dive finds itself hunted by giant prehistoric sharks and a ruthless mining operation.'],
            ['transformers-rise-of-the-beasts', 'Transformers: Rise of the Beasts', 'upcoming', 2023, '4K', 107, null, 8.6, 'Action / Sci-Fi', 'transformers-rise-of-the-beasts.jpg',
                'In 1994 the Autobots join the Maximals to stand against a new enemy threatening Earth.'],

            // ---------------- TOP RATED ----------------
            ['sonic-2', 'Sonic the Hedgehog 2', 'top_rated', 2022, 'HD', 137, null, 8.5, 'Family / Adventure', 'sonic-2.png',
                'Sonic and Tails race to stop Dr. Robotnik and Knuckles from getting their hands on a powerful emerald.'],
            ['morbius', 'Morbius', 'top_rated', 2022, '2K', null, null, null, 'Action / Horror', 'morbius.png',
                'Dr. Michael Morbius tries to cure a rare blood disease and ends up with dangerous vampiric abilities.'],
            ['the-batman', 'The Batman', 'top_rated', 2022, '4K', 107, null, null, 'Crime / Action', 'the-batman.png',
                'Batman investigates a series of murders in Gotham City that expose the city\'s deepest corruption.'],
            ['free-guy', 'Free Guy', 'top_rated', 2021, '4K', null, null, 9.2, 'Comedy / Sci-Fi', 'free-guy.png',
                'A bank teller discovers he is a background character in an open-world video game and decides to become the hero.'],
            ['uncharted', 'Uncharted', 'top_rated', 2022, '4K', null, null, null, 'Adventure / Action', 'uncharted.png',
                'Nathan Drake and Victor "Sully" Sullivan chase a legendary lost treasure around the world.'],
            ['kingsman', 'Kingsman', 'top_rated', null, '4K', null, null, 8.6, 'Action / Spy', 'kingsman.png',
                'The secret agents of an independent spy organisation take on global threats in style.'],

            // ---------------- TV SERIES ----------------
            ['moon-knight', 'Moon Knight', 'series', 2022, '2K', null, 6, 8.6, 'Action / Mystery', 'moon-knight.png',
                'Steven Grant, a mild-mannered gift-shop employee, finds himself drawn into a world of Egyptian gods.'],
            ['money-heist', 'Money Heist', 'series', 2017, '4K', null, 41, 8.3, 'Crime / Thriller', 'money-heist.png',
                'A mastermind known as the Professor leads a gang of thieves in an ambitious robbery of the Royal Mint of Spain.'],
            ['loki', 'Loki', 'series', 2021, 'HD', null, 6, 8.4, 'Fantasy / Sci-Fi', 'loki.jpg',
                'After stealing the Tesseract, Loki is pulled out of time by the Time Variance Authority.'],
            ['the-mandalorian', 'The Mandalorian', 'series', 2019, '5K', null, 24, 9.0, 'Sci-Fi / Western', 'the-mandalorian.webp',
                'A lone bounty hunter travels the outer reaches of the galaxy, far from the authority of the New Republic.'],
            ['stranger-things', 'Stranger Things', 'series', 2016, '4K', null, 34, 9.2, 'Sci-Fi / Horror', 'stranger-things.jpg',
                'When a boy vanishes, a small town uncovers secret experiments, supernatural forces and one strange girl.'],
            ['the-queens-gambit', 'The Queen\'s Gambit', 'series', 2020, '4K', null, 7, 8.6, 'Drama', 'the-queens-gambit.jpg',
                'Orphaned chess prodigy Beth Harmon rises to the top of the chess world while fighting personal demons.'],
        ];

        foreach ($rows as [$slug, $title, $category, $year, $quality, $runtime, $episodes, $rating, $genre, $poster, $synopsis]) {
            Movie::updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'category' => $category,
                'year' => $year,
                'quality' => $quality,
                'runtime_minutes' => $runtime,
                'episodes' => $episodes,
                'rating' => $rating,
                'genre' => $genre,
                'synopsis' => $synopsis,
                'poster' => "/assets/movies/{$poster}",
                // only Doctor Strange had a wide backdrop in the old project
                'backdrop' => $slug === 'doctor-strange-multiverse' ? '/assets/movies/doctor-strange-backdrop.jpg' : null,
                'trailer_url' => ($trailers[$slug] ?? '') ?: null,
            ]);
        }
    }
}
