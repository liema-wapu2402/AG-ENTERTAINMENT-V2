<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Artist;
use Illuminate\Database\Eloquent\Model;

/** Admin: artists. */
class ArtistAdminController extends ResourceController
{
    protected function model(): string { return Artist::class; }

    protected function searchColumns(): array { return ['name']; }

    protected function counts(): array { return ['tracks']; }

    protected function visible(): array { return ['image_path']; }

    protected function slugFrom(): ?string { return 'name'; }

    protected function files(): array { return ['image_file' => ['image_path', 'artists']]; }

    protected function rules(?Model $record): array
    {
        return [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:female,male,group',
            'image_file' => 'nullable|image|max:5120',
        ];
    }
}
