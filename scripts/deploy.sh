#!/bin/sh
set -eu

diagnose() {
  result=$?
  if [ "$result" -ne 0 ]; then
    echo 'Deployment failed. Container state, application logs, and health-check output:'
    docker compose ps -a || true
    docker compose logs --no-color --tail=100 portfolio storage-init caddy || true
    docker inspect --format '{{json .State}}' portfolio || true
  fi
  exit "$result"
}
trap diagnose EXIT

docker compose config --quiet
docker compose pull
docker compose up -d --wait --wait-timeout 180 --remove-orphans
# Replacing a single-file bind mount can leave the container holding the old
# inode. Recreate the proxy to attach the current Caddyfile; TLS data persists.
docker compose up -d --no-deps --force-recreate --wait --wait-timeout 60 caddy
docker compose exec -T caddy wget -q -O - http://portfolio:5000/api/health
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
docker image prune -f
