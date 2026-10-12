<?php

// Lets the React dev server / production frontend call the API from another origin.
return [
    'paths' => ['api/*', 'storage/*'],
    'allowed_methods' => ['*'],
    // Comma separated list in .env: FRONTEND_URL=http://localhost:5173,https://your-site.com
    'allowed_origins' => array_filter(explode(',', env('FRONTEND_URL', 'http://localhost:5173'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // we use bearer tokens, not cookies
];
