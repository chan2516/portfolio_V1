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
# A bind-mounted Caddyfile can change while an existing Caddy process keeps
# its previous configuration. Reload explicitly after the API is healthy.
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
docker image prune -f
