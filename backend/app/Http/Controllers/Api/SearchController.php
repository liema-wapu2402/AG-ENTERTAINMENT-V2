<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Movie;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** One endpoint that powers the sidebar search box. */
class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['movies' => [], 'tracks' => [], 'books' => []]);
        }

        // Escape LIKE wildcards typed by the user.
        $like = '%'.addcslashes($q, '%_\\').'%';

        return response()->json([
            'movies' => Movie::where('title', 'like', $like)->limit(5)->get(),
            'tracks' => Track::with('artist:id,slug,name')
                ->where('title', 'like', $like)
                ->orWhereHas('artist', fn ($a) => $a->where('name', 'like', $like))
                ->limit(5)->get(),
            'books' => Book::where('title', 'like', $like)->orWhere('author', 'like', $like)->limit(5)->get(),
        ]);
    }
}
