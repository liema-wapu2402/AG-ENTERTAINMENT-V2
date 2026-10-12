<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    protected $fillable = ['genre_id', 'slug', 'title', 'author', 'year', 'pages', 'synopsis', 'cover_path'];

    protected $hidden = ['cover_path', 'genre_id'];

    protected $appends = ['cover_url'];

    public function genre(): BelongsTo
    {
        return $this->belongsTo(BookGenre::class, 'genre_id');
    }

    /** Uploaded cover (storage/app/public/books/...). When null, React draws a generated cover. */
    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? Storage::disk('public')->url($this->cover_path) : null;
    }
}
