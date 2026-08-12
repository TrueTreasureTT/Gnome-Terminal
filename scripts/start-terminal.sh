#!/usr/bin/env bash
set -euo pipefail

# Start backend in background
if [ -f ".venv/bin/activate" ]; then
  . .venv/bin/activate
fi

# Start backend
echo "Starting backend..."
python backend/server.py &
BACKEND_PID=$!

echo "Starting frontend dev server..."
cd frontend || exit 0
npm install
npm run dev &
FRONT_PID=$!

trap "echo 'Stopping...'; kill $BACKEND_PID $FRONT_PID 2>/dev/null || true; exit 0" SIGINT SIGTERM
wait
