<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\BookGenre;
use Illuminate\Database\Eloquent\Model;

/** Admin: book genres (shelves). */
class BookGenreAdminController extends ResourceController
{
    protected function model(): string { return BookGenre::class; }

    protected function searchColumns(): array { return ['name']; }

    protected function counts(): array { return ['books']; }

    protected function visible(): array { return ['sort_order']; }

    protected function slugFrom(): ?string { return 'name'; }

    protected function rules(?Model $record): array
    {
        return [
            'name' => 'required|string|max:255',
            'icon' => 'required|in:wand,rocket,search,heart,skull,landmark,lightbulb,compass',
            'description' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0|max:1000',
        ];
    }
}
