#!/bin/sh

HOST="$1"
PORT="$2"

shift 2

echo "Esperando a $HOST:$PORT..."

while ! nc -z "$HOST" "$PORT"; do
  sleep 1
  echo "Esperando a $HOST:$PORT..."
done

echo "Conexión exitosa a $HOST:$PORT"

exec "$@"
