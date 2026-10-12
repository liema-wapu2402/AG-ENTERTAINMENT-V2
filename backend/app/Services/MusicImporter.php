<?php

namespace App\Services;

use App\Models\Artist;
use App\Models\Track;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Scans storage/app/public/music/<Artist>/*.mp3 and imports it into MySQL.
 * Used by `php artisan music:import` and by the admin panel ("Scan folder" button).
 */
class MusicImporter
{
    private const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp'];

    /** @return array{imported:int, titles:string[]} */
    public function scan(string $root = 'music'): array
    {
        $disk = Storage::disk('public');
        $root = trim($root, '/');
        $titles = [];

        if (! $disk->exists($root)) {
            $disk->makeDirectory($root);

            return ['imported' => 0, 'titles' => []];
        }

        foreach ($disk->directories($root) as $dir) {
            $artist = $this->artistFor($dir);
            $default = $this->findImage($dir, ['cover']);

            foreach ($disk->files($dir) as $file) {
                if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) !== 'mp3') {
                    continue;
                }
                $base = pathinfo($file, PATHINFO_FILENAME);
                $title = $this->cleanTitle($base);

                Track::updateOrCreate(['file_path' => $file], [
                    'artist_id' => $artist->id,
                    'title' => $title,
                    'cover_path' => $this->findImage($dir, [$base]) ?? $default ?? $artist->image_path,
                    'duration_seconds' => $this->duration($disk->path($file)),
                ]);
                $titles[] = "{$artist->name} - {$title}";
            }
        }

        return ['imported' => count($titles), 'titles' => $titles];
    }

    /** "01 - Bad Guy" -> "Bad Guy" */
    public function cleanTitle(string $base): string
    {
        $title = trim(preg_replace('/^\d{1,3}\s*[-._]\s*/', '', $base));

        return $title !== '' ? $title : $base;
    }

    /** Duration in seconds via getID3 (composer require phansys/getid3); null when not installed. */
    public function duration(string $absolutePath): ?int
    {
        if (! class_exists(\getID3::class)) {
            return null;
        }
        $info = (new \getID3())->analyze($absolutePath);

        return isset($info['playtime_seconds']) ? (int) round($info['playtime_seconds']) : null;
    }

    private function artistFor(string $dir): Artist
    {
        $name = basename($dir);
        $artist = Artist::firstOrCreate(['slug' => Str::slug($name)], ['name' => Str::headline($name), 'gender' => 'group']);

        $image = $this->findImage($dir, ['artist']);
        if ($image && $artist->image_path !== $image) {
            $artist->update(['image_path' => $image]);
        }

        return $artist;
    }

    private function findImage(string $dir, array $names): ?string
    {
        $disk = Storage::disk('public');
        foreach ($names as $name) {
            foreach (self::IMAGE_EXT as $ext) {
                if ($disk->exists("{$dir}/{$name}.{$ext}")) {
                    return "{$dir}/{$name}.{$ext}";
                }
            }
        }

        return null;
    }
}
