#!/bin/sh
set -e

# Ensure required dirs
mkdir -p /var/www/db /var/www/cgi-bin /var/www/data

DB_PATH_ENV=${DB_PATH:-/var/www/db/rayit.db}

run_migrations() {
  # If database does not exist, create it and apply all migrations
  if [ ! -f "$DB_PATH_ENV" ]; then
    echo "Creating database at $DB_PATH_ENV"
    sqlite3 -cmd ".timeout 5000" "$DB_PATH_ENV" < /var/www/html/DB/migrations/001_init.sql || true

    if [ -d /var/www/html/DB/migrations ]; then
      for f in /var/www/html/DB/migrations/*.sql; do
        [ -f "$f" ] || continue
        echo "Applying migration: $f"
        sqlite3 -cmd ".timeout 5000" "$DB_PATH_ENV" < "$f" || true
      done
    fi
  else
    echo "Database already exists at $DB_PATH_ENV; skipping migrations."
  fi
}

# Decide whether to run migrations
if [ "${RUN_MIGRATIONS:-false}" != "false" ]; then
  run_migrations
fi

# If asked to run graderd, exec it
if [ "$1" = "./graderd" ] || [ "$1" = "graderd" ]; then
  exec "$@"
fi

# Otherwise run web stack (FastCGI app + nginx)
cp /var/www/html/nginx_config.container.conf /etc/nginx/sites-available/default

# Start the C++ FastCGI application that listens on 127.0.0.1:9000
# Run as www-data for safety
su -s /bin/sh -c "/var/www/html/cgi-bin/api.cgi &" www-data

exec nginx -g 'daemon off;'
