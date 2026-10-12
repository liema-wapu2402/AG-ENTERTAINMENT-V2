<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Creates the first administrator.
 * Set ADMIN_NAME / ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env before seeding.
 * If ADMIN_PASSWORD is empty a random one is generated and printed ONCE in the terminal.
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD') ?: Str::random(14);

        $admin = User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@agentertainment.test')],
            [
                'name' => env('ADMIN_NAME', 'Administrator'),
                'username' => env('ADMIN_USERNAME', 'admin'),
                'password' => $password,
                'role' => 'admin',
            ]
        );

        if (! env('ADMIN_PASSWORD')) {
            $this->command?->warn("Admin created -> username: {$admin->username}  email: {$admin->email}  password: {$password}");
            $this->command?->warn('Save this password now, it is not shown again.');
        }
    }
}
