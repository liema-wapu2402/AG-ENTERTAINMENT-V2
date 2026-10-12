#!/usr/bin/env bash
# Builds a complete Laravel project in ./backend around the custom files already there.
set -e
composer create-project laravel/laravel _skeleton --no-interaction
cp -rn _skeleton/. backend/        # -n = never overwrite the custom files
rm -rf _skeleton
cd backend
composer require laravel/sanctum phansys/getid3 --no-interaction
php artisan install:api --no-interaction
[ -f .env ] || cp .env.example .env
php artisan key:generate
echo "Done. Edit backend/.env (MySQL + APP_URL), then run: php artisan migrate --seed && php artisan storage:link && php artisan serve"
