<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Track;
use App\Services\MusicImporter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/** Admin: songs (real mp3 uploads). */
class TrackAdminController extends ResourceController
{
    protected function model(): string { return Track::class; }

    protected function with(): array { return ['artist:id,slug,name']; }

    protected function searchColumns(): array { return ['title', 'album']; }

    protected function visible(): array { return ['file_path', 'cover_path']; }

    protected function files(): array
    {
        return [
            'audio_file' => ['file_path', 'tracks'],
            'cover_file' => ['cover_path', 'track-covers'],
        ];
    }

    protected function rules(?Model $record): array
    {
        return [
            'artist_id' => 'required|exists:artists,id',
            'title' => 'required|string|max:255',
            'album' => 'nullable|string|max:255',
            // mp3 only, 50 MB max (also raise upload_max_filesize / post_max_size in php.ini)
            'audio_file' => [$record ? 'nullable' : 'required', 'file', 'mimes:mp3,mpga', 'max:51200'],
            'cover_file' => 'nullable|image|max:5120',
        ];
    }

    /** Reads the mp3 length after a new file was stored. */
    protected function prepare(array $data, ?Model $record): array
    {
        if (isset($data['file_path']) && ($record?->file_path !== $data['file_path'])) {
            $data['duration_seconds'] = app(MusicImporter::class)->duration(Storage::disk('public')->path($data['file_path']));
        }

        return $data;
    }

    /** POST /api/admin/tracks/upload  (artist_id + files[]) -> many mp3 files at once. */
    public function upload(Request $request, MusicImporter $importer): JsonResponse
    {
        $request->validate([
            'artist_id' => 'required|exists:artists,id',
            'files' => 'required|array|max:50',
            'files.*' => ['file', 'mimes:mp3,mpga', 'max:51200'],
        ]);

        $created = [];
        foreach ($request->file('files') as $file) {
            $path = $file->store('tracks', 'public');
            $created[] = Track::create([
                'artist_id' => $request->artist_id,
                'title' => $importer->cleanTitle(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)),
                'file_path' => $path,
                'duration_seconds' => $importer->duration(Storage::disk('public')->path($path)),
            ])->id;
        }

        return response()->json(['imported' => count($created)], 201);
    }

    /** POST /api/admin/music/scan -> imports the mp3 files sitting in storage/app/public/music/<Artist>/ */
    public function scan(MusicImporter $importer): JsonResponse
    {
        return response()->json($importer->scan());
    }
}
