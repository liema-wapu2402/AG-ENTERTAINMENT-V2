<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookGenre extends Model
{
    protected $fillable = ['slug', 'name', 'icon', 'description', 'sort_order'];

    protected $hidden = ['sort_order'];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'genre_id');
    }
}
