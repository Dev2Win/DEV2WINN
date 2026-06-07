#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_PYTHON="$ROOT_DIR/dev2win/bin/python"

if [ ! -x "$VENV_PYTHON" ]; then
  echo "Missing virtualenv at $ROOT_DIR/dev2win"
  echo "Create it with: python3 -m venv dev2win"
  echo "Then install deps with: dev2win/bin/python -m pip install -r ai/requirements.txt"
  exit 1
fi

if [ -f "$ROOT_DIR/.env.local" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env.local"
  set +a
fi

cd "$ROOT_DIR/ai"
export PYTHONPATH=.

HOST="${AI_HOST:-127.0.0.1}"
PORT="${PORT:-8000}"

exec "$VENV_PYTHON" -m uvicorn app.main:app --host "$HOST" --port "$PORT"
