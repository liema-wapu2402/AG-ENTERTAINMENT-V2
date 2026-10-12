<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookGenre;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    /** GET /api/book-genres -> every genre with its books (one query + one eager load). */
    public function genres(): JsonResponse
    {
        return response()->json(
            BookGenre::with(['books' => fn ($q) => $q->orderBy('title')])->orderBy('sort_order')->get()
        );
    }
}
