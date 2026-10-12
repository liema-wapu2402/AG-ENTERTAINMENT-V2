<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\Book;
use App\Models\Movie;
use App\Models\Track;
use Illuminate\Http\JsonResponse;

/** Data for the home page: counters + one featured row per module. */
class HomeController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'movies' => Movie::count(),
                'tracks' => Track::count(),
                'artists' => Artist::count(),
                'books' => Book::count(),
            ],
            // upcoming first, then top rated, then series
            'movies' => Movie::orderByRaw("FIELD(category, 'upcoming', 'top_rated', 'series')")->orderBy('id')->limit(12)->get(),
            'artists' => Artist::withCount('tracks')->orderBy('id')->limit(12)->get(),
            'books' => Book::with('genre:id,slug,name')->orderBy('id')->limit(12)->get(),
        ]);
    }
}
