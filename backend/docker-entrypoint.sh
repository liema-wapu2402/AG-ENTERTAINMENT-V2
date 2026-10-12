#!/bin/sh
set -e

# Render tells us which port to listen on.
PORT="${PORT:-10000}"
sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Aiven MySQL requires SSL. Paste the project's CA certificate (ca.pem) into the
# AIVEN_CA_CERT env var on Render; we write it to disk and point Laravel at it.
if [ -n "$AIVEN_CA_CERT" ]; then
  printf '%s\n' "$AIVEN_CA_CERT" > /etc/ssl/certs/aiven-ca.pem
  export MYSQL_ATTR_SSL_CA=/etc/ssl/certs/aiven-ca.pem
fi

cd /var/www/html
php artisan storage:link --force || true
php artisan config:cache
php artisan route:cache

php artisan migrate --force

# Seed ONLY when asked (first deploy). Seeders overwrite rows by slug, so running them
# on every deploy would undo edits made in the admin panel.
if [ "$RUN_SEED" = "true" ]; then
  php artisan db:seed --force
fi

chown -R www-data:www-data storage bootstrap/cache
exec apache2-foreground
