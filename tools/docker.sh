#!/bin/sh
# Runs a command inside the pinned Playwright image. Only this project folder is mounted.
#
#   tools/docker.sh npm test              no network (default)
#   NET=1 tools/docker.sh npm install     with network, for installs and downloads
set -eu

# Pinned by digest, so every run uses exactly the same browser and system fonts.
IMAGE="mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

NETWORK="--network=none"
if [ "${NET:-0}" = "1" ]; then
  NETWORK=""
fi

# shellcheck disable=SC2086
exec docker run --rm --init --ipc=host $NETWORK \
  -e HOME=/tmp -e npm_config_update_notifier=false \
  -v "$ROOT":/work -w /work \
  "$IMAGE" "$@"
