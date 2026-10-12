<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'name', 'gender', 'image_path'];

    protected $hidden = ['image_path'];

    protected $appends = ['image_url'];

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
