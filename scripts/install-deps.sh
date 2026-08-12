#!/usr/bin/env bash
set -euo pipefail

echo "Installing system dependencies (Debian/Ubuntu)..."
sudo apt-get update
sudo apt-get install -y python3 python3-venv python3-dev build-essential 
# GTK/VTE dev libs for native builds if you plan to compile native terminal widgets
sudo apt-get install -y libgtk-3-dev libvte-2.91-dev

# Node
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js (LTS)..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "Done. Create a virtualenv with 'python3 -m venv .venv' and activate it before running the backend."
