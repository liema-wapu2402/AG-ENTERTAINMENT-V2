<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Laravel 11/12 application bootstrap.
// The React app talks to /api/* with a Sanctum bearer token, so no cookie/stateful setup is needed.
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Render terminates HTTPS at its proxy; trust it so Laravel sees https and the real client IP.
        $middleware->trustProxies(at: '*');
        // CORS is handled by Laravel's built-in HandleCors middleware (see config/cors.php).
        // 'admin' middleware = only users with role=admin (used by /api/admin routes).
        $middleware->alias(['admin' => \App\Http\Middleware\EnsureAdmin::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
