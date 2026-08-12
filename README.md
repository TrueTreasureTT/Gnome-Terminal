# gnome-terminal-clone

A VTE and GTK-based terminal emulator mimicking Ubuntu 26.04 LTS.

This repository includes a small example WebSocket+PTY backend and a TypeScript React frontend (xterm.js) so you can run a terminal in the browser. It also contains Docker and nginx examples for hosting on the web.

Quick start (development):

1. Install system deps: `bash scripts/install-deps.sh`
2. Start backend: `make backend`
3. Start frontend (in another shell): `make frontend`

See HOSTING.md and docs/DEPLOYMENT.md for hosting and production deployment tips.
