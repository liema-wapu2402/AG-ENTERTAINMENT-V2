<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /** GET /api/movies?category=upcoming|top_rated|series */
    public function index(Request $request): JsonResponse
    {
        $request->validate(['category' => 'nullable|in:upcoming,top_rated,series']);

        return response()->json(
            Movie::category($request->query('category'))
                ->orderByRaw("FIELD(category, 'upcoming', 'top_rated', 'series')")
                ->orderBy('id')
                ->get()
        );
    }

    /** GET /api/movies/{slug} -> the movie + related titles from the same category. */
    public function show(string $slug): JsonResponse
    {
        $movie = Movie::where('slug', $slug)->firstOrFail();

        $related = Movie::where('category', $movie->category)
            ->where('id', '!=', $movie->id)
            ->limit(10)
            ->get();

        return response()->json(['movie' => $movie, 'related' => $related]);
    }
}
