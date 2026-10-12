<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\Book;
use App\Models\BookGenre;
use App\Models\Movie;
use App\Models\Track;
use Illuminate\Http\JsonResponse;

/** Admin dashboard numbers + latest additions per module. */
class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'counts' => [
                'movies' => Movie::where('category', '!=', 'series')->count(),
                'series' => Movie::where('category', 'series')->count(),
                'artists' => Artist::count(),
                'tracks' => Track::count(),
                'genres' => BookGenre::count(),
                'books' => Book::count(),
            ],
            'latest' => [
                'movies' => Movie::latest('id')->limit(5)->get(['id', 'title', 'category', 'created_at']),
                'tracks' => Track::with('artist:id,name')->latest('id')->limit(5)->get(['id', 'artist_id', 'title', 'created_at']),
                'books' => Book::latest('id')->limit(5)->get(['id', 'title', 'author', 'created_at']),
            ],
        ]);
    }
}
