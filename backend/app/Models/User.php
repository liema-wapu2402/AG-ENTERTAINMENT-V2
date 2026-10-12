<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

/**
 * Site member. Replaces the old `users` table (fname, username, email, contact, password, pp).
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'username', 'email', 'contact', 'password', 'pp', 'role'];

    protected $hidden = ['password', 'remember_token', 'pp'];

    // pp_url is added to the JSON so React can show the avatar directly.
    protected $appends = ['pp_url'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /** Public URL of the profile picture (or null when none was uploaded). */
    public function getPpUrlAttribute(): ?string
    {
        return $this->pp ? Storage::disk('public')->url($this->pp) : null;
    }
}
