<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * A movie OR a TV series (see `category`). Trailers are YouTube links.
 */
class Movie extends Model
{
    protected $fillable = [
        'slug', 'title', 'category', 'year', 'quality', 'runtime_minutes', 'episodes',
        'rating', 'genre', 'synopsis', 'poster', 'backdrop', 'trailer_url',
    ];

    protected $casts = ['rating' => 'float', 'year' => 'integer'];

    protected $hidden = ['poster', 'backdrop'];

    // Adds `trailer_youtube_id` to every JSON response.
    protected $appends = ['trailer_youtube_id', 'poster_url', 'backdrop_url'];

    /** Turns a stored value into a URL: '/assets/..' and http(s) stay as they are, anything else is an uploaded file. */
    private function resolveImage(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        return str_starts_with($value, '/') || str_starts_with($value, 'http')
            ? $value
            : Storage::disk('public')->url($value);
    }

    public function getPosterUrlAttribute(): ?string
    {
        return $this->resolveImage($this->poster);
    }

    public function getBackdropUrlAttribute(): ?string
    {
        return $this->resolveImage($this->backdrop);
    }

    /** Lets controllers do Movie::category('series'). */
    public function scopeCategory($query, ?string $category)
    {
        return $category ? $query->where('category', $category) : $query;
    }

    /**
     * Extracts the video id from any common YouTube link:
     * watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID
     */
    public function getTrailerYoutubeIdAttribute(): ?string
    {
        if (! $this->trailer_url) {
            return null;
        }
        $pattern = '~(?:youtu\.be/|youtube(?:-nocookie)?\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|v/))([A-Za-z0-9_-]{11})~';

        return preg_match($pattern, $this->trailer_url, $m) ? $m[1] : null;
    }
}
