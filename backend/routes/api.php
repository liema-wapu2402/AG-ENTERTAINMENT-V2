<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\MusicController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AG Entertainment API  (all routes are prefixed with /api)
|--------------------------------------------------------------------------
*/

// ---- Public content --------------------------------------------------------
Route::get('/home', HomeController::class);          // hero stats + featured rows
Route::get('/search', SearchController::class);      // sidebar search (movies, songs, books)

Route::get('/movies', [MovieController::class, 'index']);          // ?category=upcoming|top_rated|series
Route::get('/movies/{slug}', [MovieController::class, 'show']);

Route::get('/artists', [MusicController::class, 'artists']);
Route::get('/artists/{slug}', [MusicController::class, 'artist']);
Route::get('/tracks', [MusicController::class, 'tracks']);         // ?limit=12

Route::get('/book-genres', [BookController::class, 'genres']);     // genres with their books

// ---- Authentication --------------------------------------------------------
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// ---- Admin panel (sign in required + role = admin) ---------------------------
// Visitors never touch these. The React admin area calls them with the admin's token.
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', Admin\DashboardController::class);

    // extra actions first (so they are not mistaken for {id})
    Route::post('/movies/import', [Admin\MovieAdminController::class, 'import']);   // CSV
    Route::post('/books/import', [Admin\BookAdminController::class, 'import']);     // CSV
    Route::post('/tracks/upload', [Admin\TrackAdminController::class, 'upload']);   // many mp3 files
    Route::post('/music/scan', [Admin\TrackAdminController::class, 'scan']);        // import storage/app/public/music

    // add / list / edit / delete
    Route::apiResource('movies', Admin\MovieAdminController::class)->except('show');
    Route::apiResource('artists', Admin\ArtistAdminController::class)->except('show');
    Route::apiResource('tracks', Admin\TrackAdminController::class)->except('show');
    Route::apiResource('book-genres', Admin\BookGenreAdminController::class)->except('show');
    Route::apiResource('books', Admin\BookAdminController::class)->except('show');
});
