<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MusicController extends Controller
{
    /** GET /api/artists -> every artist with a song counter. */
    public function artists(): JsonResponse
    {
        return response()->json(Artist::withCount('tracks')->orderBy('name')->get());
    }

    /** GET /api/artists/{slug} -> artist + all of their tracks. */
    public function artist(string $slug): JsonResponse
    {
        $artist = Artist::where('slug', $slug)
            ->withCount('tracks')
            ->with(['tracks' => fn ($q) => $q->orderBy('title')])
            ->firstOrFail();

        return response()->json($artist);
    }

    /** GET /api/tracks?limit=12 -> newest imported songs (with artist name). */
    public function tracks(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 12), 1), 100);

        return response()->json(
            Track::with('artist:id,slug,name')->latest('id')->limit($limit)->get()
        );
    }
}
