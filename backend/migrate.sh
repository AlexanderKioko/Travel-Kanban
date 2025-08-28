#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Django migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Migrations complete."