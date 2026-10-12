<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** Admin: movies + TV series. */
class MovieAdminController extends ResourceController
{
    protected function model(): string { return Movie::class; }

    protected function searchColumns(): array { return ['title', 'genre']; }

    protected function visible(): array { return ['poster', 'backdrop']; }

    protected function slugFrom(): ?string { return 'title'; }

    protected function files(): array
    {
        return [
            'poster_file' => ['poster', 'posters'],
            'backdrop_file' => ['backdrop', 'backdrops'],
        ];
    }

    private function baseRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|in:upcoming,top_rated,series',
            'year' => 'nullable|integer|between:1888,2100',
            'quality' => 'nullable|string|max:10',
            'runtime_minutes' => 'nullable|integer|min:1|max:1000',
            'episodes' => 'nullable|integer|min:1|max:5000',
            'rating' => 'nullable|numeric|between:0,10',
            'genre' => 'nullable|string|max:255',
            'synopsis' => 'nullable|string|max:5000',
            'trailer_url' => ['nullable', 'url', 'max:255', 'regex:~(youtu\.be/|youtube(-nocookie)?\.com/)~i'], // YouTube links only
        ];
    }

    protected function rules(?Model $record): array
    {
        return $this->baseRules() + [
            'poster_file' => 'nullable|image|max:5120',
            'backdrop_file' => 'nullable|image|max:5120',
        ];
    }

    protected function prepare(array $data, ?Model $record): array
    {
        // a new movie without an uploaded poster gets the AG logo as placeholder
        if (! $record && empty($data['poster'])) {
            $data['poster'] = '/assets/brand/logo-mark.png';
        }

        return $data;
    }

    protected function importColumns(): array
    {
        return ['title', 'category', 'year', 'quality', 'runtime_minutes', 'episodes', 'rating', 'genre', 'synopsis', 'trailer_url', 'poster'];
    }

    protected function importRow(array $row): array
    {
        $data = $this->validateRow($row, $this->baseRules());

        return [
            ['slug' => Str::slug($data['title'].' '.($data['year'] ?? ''))],
            $data + ['poster' => $row['poster'] ?? '/assets/brand/logo-mark.png'],
        ];
    }
}
