<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Admin sign in. Visitors never sign in - the public site is view-only.
 * There is no public registration; admins are created with the seeder or `php artisan tinker`.
 */
class AuthController extends Controller
{
    /** POST /api/auth/login  { login: "username or email", password } */
    public function login(Request $request): JsonResponse
    {
        $request->validate(['login' => 'required|string', 'password' => 'required|string']);

        $field = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $user = User::where($field, $request->login)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['login' => 'Incorrect username/email or password.']);
        }
        if (! $user->isAdmin()) {
            throw ValidationException::withMessages(['login' => 'Only administrators can sign in.']);
        }

        return response()->json([
            'token' => $user->createToken('admin-panel')->plainTextToken,
            'user' => $user,
        ]);
    }

    /** GET /api/auth/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /** POST /api/auth/logout -> revokes the token used for this request. */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
