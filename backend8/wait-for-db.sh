#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

echo "Waiting for postgres at $host:5432..."

until pg_isready -h "$host" -p 5432; do
  echo "$(date) - waiting for postgres..."
  sleep 2
done

echo "Postgres is up, running command."
exec $cmd