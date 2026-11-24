#!/bin/sh
# Runs a command the way a user who installed the plugin would, inside the pinned Playwright image:
#   /plugin        this project's plugin/ folder, read-only, with no node_modules above it
#   /home/e2e      an empty home folder, kept in out/e2e/<name>/home (setup installs into ~/.cache there)
#   /work          the user's working folder, kept in out/e2e/<name>/work (the current folder)
# The network is on, because the first-run setup downloads Playwright.
#
#   E2E=compost tools/e2e-run.sh node /plugin/skills/swipe-styles/scripts/setup.mjs
#   E2E=compost tools/e2e-run.sh node /plugin/skills/swipe-styles/core/render.mjs carousels/x/carousel.json
#   E2E=fresh PLAYWRIGHT_BROWSERS_PATH=/home/e2e/browsers tools/e2e-run.sh ...   (no browser preinstalled)
#   rm -rf out/e2e/<name>                                                       (start over)
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="$(sed -n 's/^IMAGE="\(.*\)"$/\1/p' "$ROOT/tools/docker.sh")"
NAME="${E2E:-default}"
case "$NAME" in
  *[!a-z0-9-]*) echo "E2E must be lowercase letters, digits and dashes" >&2; exit 1 ;;
esac
DIR="$ROOT/out/e2e/$NAME"
mkdir -p "$DIR/home" "$DIR/work"

BROWSERS=""
if [ -n "${PLAYWRIGHT_BROWSERS_PATH:-}" ]; then
  BROWSERS="-e PLAYWRIGHT_BROWSERS_PATH=$PLAYWRIGHT_BROWSERS_PATH"
fi

# shellcheck disable=SC2086
exec docker run --rm --init --ipc=host $BROWSERS \
  -e HOME=/home/e2e -e npm_config_update_notifier=false \
  -v "$ROOT/plugin":/plugin:ro \
  -v "$DIR/home":/home/e2e \
  -v "$DIR/work":/work -w /work \
  "$IMAGE" "$@"
