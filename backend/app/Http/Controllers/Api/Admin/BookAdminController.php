<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Book;
use App\Models\BookGenre;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** Admin: books. */
class BookAdminController extends ResourceController
{
    protected function model(): string { return Book::class; }

    protected function with(): array { return ['genre:id,slug,name']; }

    protected function searchColumns(): array { return ['title', 'author']; }

    protected function visible(): array { return ['genre_id', 'cover_path']; }

    protected function slugFrom(): ?string { return 'title'; }

    protected function files(): array { return ['cover_file' => ['cover_path', 'books']]; }

    private function baseRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'year' => 'nullable|integer|between:-3000,2100',
            'pages' => 'nullable|integer|min:1|max:20000',
            'synopsis' => 'nullable|string|max:5000',
        ];
    }

    protected function rules(?Model $record): array
    {
        return $this->baseRules() + [
            'genre_id' => 'required|exists:book_genres,id',
            'cover_file' => 'nullable|image|max:5120',
        ];
    }

    protected function importColumns(): array
    {
        return ['title', 'author', 'genre', 'year', 'pages', 'synopsis'];
    }

    /** CSV rows name the genre ("Fantasy"); missing genres are created automatically. */
    protected function importRow(array $row): array
    {
        $data = $this->validateRow($row, $this->baseRules());
        if (empty($row['genre'])) {
            throw new \InvalidArgumentException('genre is required');
        }
        $genre = BookGenre::firstOrCreate(
            ['slug' => Str::slug($row['genre'])],
            ['name' => Str::headline($row['genre']), 'icon' => 'wand', 'sort_order' => BookGenre::max('sort_order') + 1]
        );

        return [['slug' => Str::slug($data['title'])], $data + ['genre_id' => $genre->id]];
    }
}
