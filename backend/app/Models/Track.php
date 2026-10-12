<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * One mp3 file. `file_path` is relative to storage/app/public (e.g. music/adele/hello.mp3).
 */
class Track extends Model
{
    protected $fillable = ['artist_id', 'title', 'album', 'file_path', 'cover_path', 'duration_seconds'];

    protected $hidden = ['file_path', 'cover_path'];

    // audio_url + cover_url are what the React player uses.
    protected $appends = ['audio_url', 'cover_url'];

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    public function getAudioUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? Storage::disk('public')->url($this->cover_path) : null;
    }
}
