# Builds a complete Laravel project in .\backend around the custom files already there.
$ErrorActionPreference = "Stop"
composer create-project laravel/laravel _skeleton --no-interaction
# robocopy: copy only files that do not exist yet (never overwrite the custom files)
robocopy _skeleton backend /E /XC /XN /XO /NFL /NDL /NJH /NJS | Out-Null
Remove-Item _skeleton -Recurse -Force
Set-Location backend
composer require laravel/sanctum phansys/getid3 --no-interaction
php artisan install:api --no-interaction
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
Write-Host "Done. Edit backend/.env (MySQL + APP_URL), then run: php artisan migrate --seed; php artisan storage:link; php artisan serve"
