<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Adds the extra columns of the old `users` table to Laravel's default users table.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->string('contact', 30)->nullable()->after('email');
            $table->string('pp')->nullable()->after('password'); // profile picture path
            $table->enum('role', ['admin', 'user'])->default('user')->after('pp'); // only admins can sign in & edit
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'contact', 'pp', 'role']);
        });
    }
};
