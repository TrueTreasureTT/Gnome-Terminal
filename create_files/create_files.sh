#!/usr/bin/env bash
set -euo pipefail

# Run from repo root. This creates the main sample files: backend, frontend, scripts, Docker, nginx, docs.

# Create directories
mkdir -p scripts backend frontend/src frontend/public nginx docs src/app/api/health src/components/ui

# Makefile
cat > Makefile <<'EOF'
# Top-level Makefile for development tasks
.PHONY: dev backend frontend build docker-up docker-down install

dev: backend frontend

backend:
	python3 -m venv .venv && . .venv/bin/activate && pip install -r backend/requirements.txt && python backend/server.py

frontend:
	cd frontend && npm install && npm run dev

build:
	cd frontend && npm run build
docker-up:
	docker-compose up -d --build
docker-down:
	docker-compose down

install:
	bash scripts/install-deps.sh
EOF

# README.md
cat > README.md <<'EOF'
# gnome-terminal-clone

A VTE and GTK-based terminal emulator mimicking Ubuntu 26.04 LTS.

This repository includes a small example WebSocket+PTY backend and a TypeScript React frontend (xterm.js) so you can run a terminal in the browser. It also contains Docker and nginx examples for hosting on the web.

Quick start (development):

1. Install system deps: `bash scripts/install-deps.sh`
2. Start backend: `make backend`
3. Start frontend (in another shell): `make frontend`

See HOSTING.md and docs/DEPLOYMENT.md for hosting and production deployment tips.
EOF

# HOSTING.md
cat > HOSTING.md <<'EOF'
# How to Host this on the Web

This document provides step-by-step options to host the project so the terminal is accessible over the public internet.

Options:

1) Static + Backend on single server (Docker)
- Build frontend: `cd frontend && npm run build`
- Build docker images: `docker-compose up -d --build`
- Use nginx (included) to serve static files and reverse-proxy `/ws` to the backend WebSocket service.

2) Separate services (recommended for production)
- Serve the static build from a CDN or S3 + CloudFront.
- Run the backend behind an autoscaling group, behind a load balancer that supports WebSockets.
- Use TLS termination (Let's Encrypt or managed certs) on the load balancer or nginx.

3) Kubernetes
- Containerize frontend and backend (Dockerfile included).
- Use an Ingress controller that supports WebSockets (nginx-ingress, Traefik).

Important security notes
- Always use TLS (wss://) for WebSocket connections over the public internet.
- Authenticate users before allowing access to a PTY.
- Run the PTY session under a restricted user; consider containerizing per-session.
- Limit session lifetime and log commands if required by audit policy.
EOF

# Dockerfile
cat > Dockerfile <<'EOF'
# Simple Dockerfile for backend + static frontend

# Backend image
FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
EXPOSE 8765
CMD ["python", "backend/server.py"]
EOF

# docker-compose.yml
cat > docker-compose.yml <<'EOF'
version: '3.8'
services:
  backend:
    build: .
    image: gnome-terminal-clone-backend:latest
    ports:
      - "8765:8765"
    restart: unless-stopped

  nginx:
    image: nginx:stable-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - backend
EOF

# scripts/install-deps.sh
cat > scripts/install-deps.sh <<'EOF'
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
EOF
chmod +x scripts/install-deps.sh

# scripts/start-terminal.sh
cat > scripts/start-terminal.sh <<'EOF'
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
EOF
chmod +x scripts/start-terminal.sh

# backend/server.py
cat > backend/server.py <<'EOF'
"""Simple WebSocket -> PTY bridge

Usage: python backend/server.py

This starts a WebSocket server on port 8765 and spawns a shell in a PTY per connection.
"""
import asyncio
import os
import signal
import sys
import websockets
from backend.pty_handler import set_pty_winsize

HOST = '0.0.0.0'
PORT = 8765

async def handler(ws, path):
    loop = asyncio.get_running_loop()
    pid, fd = os.forkpty()
    if pid == 0:
        # Child: exec the user's shell
        shell = os.environ.get('SHELL', '/bin/bash')
        os.execv(shell, [shell])
    else:
        # Parent: forward data
        os.set_blocking(fd, False)

        def fd_to_ws():
            try:
                data = os.read(fd, 1024)
                if data:
                    asyncio.create_task(ws.send(data))
                else:
                    # EOF
                    asyncio.create_task(ws.close())
            except OSError:
                asyncio.create_task(ws.close())

        loop.add_reader(fd, fd_to_ws)

        try:
            async for msg in ws:
                # Control message for resizing: b"RESIZE:cols,rows"
                if isinstance(msg, (bytes, bytearray)):
                    os.write(fd, msg)
                else:
                    if msg.startswith('RESIZE:'):
                        try:
                            _, dims = msg.split(':', 1)
                            cols, rows = dims.split(',')
                            set_pty_winsize(fd, int(rows), int(cols))
                        except Exception:
                            pass
                    else:
                        os.write(fd, msg.encode())
        finally:
            loop.remove_reader(fd)
            try:
                os.kill(pid, signal.SIGHUP)
            except Exception:
                pass

async def main():
    async with websockets.serve(handler, HOST, PORT, max_size=None, ping_interval=None):
        print(f"WebSocket PTY server running on ws://{HOST}:{PORT}/")
        await asyncio.Future()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
EOF

# backend/pty_handler.py
cat > backend/pty_handler.py <<'EOF'
import fcntl
import termios
import struct

# Helper to set window size on a pty fd

def set_pty_winsize(fd, rows, cols):
    winsize = struct.pack('HHHH', rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)
EOF

# backend/requirements.txt
cat > backend/requirements.txt <<'EOF'
websockets
EOF

# frontend files
mkdir -p frontend/src frontend/public

cat > frontend/src/main.tsx <<'EOF'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Terminal from './Terminal'
import './styles.css'

const App = () => (
  <div className="app">
    <h1>gnome-terminal-clone (web)</h1>
    <Terminal url={location.origin.replace(/^http/, 'ws') + '/'} />
  </div>
)

createRoot(document.getElementById('root')!).render(<App />)
EOF

cat > frontend/src/Terminal.tsx <<'EOF'
import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import 'xterm/css/xterm.css'
import useWebSocket from './websocket'

type Props = { url: string }

const Terminal: React.FC<Props> = ({ url }) => {
  const termRef = useRef<XTerm | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const term = new XTerm({ rows: 24, cols: 80 })
    term.open(containerRef.current!)
    termRef.current = term

    const ws = new WebSocket(url.replace(/^http/, 'ws') + 'ws')
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.onopen = () => {
      term.write('\\r\\n\\x1b[32mConnected to backend\\x1b[0m\\r\\n')
    }

    ws.onmessage = (ev) => {
      const data = ev.data
      if (typeof data === 'string') {
        term.write(data)
      } else {
        const str = new TextDecoder().decode(data)
        term.write(str)
      }
    }

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    })

    const resize = () => {
      const cols = term.cols
      const rows = term.rows
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`RESIZE:${cols},${rows}`)
      }
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      ws.close()
      term.dispose()
    }
  }, [url])

  return <div className="terminal-container" ref={containerRef}></div>
}

export default Terminal
EOF

cat > frontend/src/websocket.ts <<'EOF'
// Small WebSocket wrapper with auto-reconnect
export default function useWebSocket(url: string) {
  // For this seed repo we'll export a factory rather than a hook
  let ws: WebSocket | null = null
  const connect = () => {
    ws = new WebSocket(url)
    return ws
  }
  return { connect, ws }
}
EOF

cat > frontend/package.json <<'EOF'
{
  "name": "gnome-terminal-clone-frontend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "xterm": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^4.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
EOF

cat > frontend/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF

cat > frontend/public/index.html <<'EOF'
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>gnome-terminal-clone</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
EOF

cat > frontend/public/client.js <<'EOF'
// Minimal JS fallback client (non-React) to demonstrate WS connection
(function(){
  const ws = new WebSocket((location.origin.replace(/^http/, 'ws')) + '/ws')
  ws.onopen = function(){ console.log('connected') }
  ws.onmessage = function(e){ console.log('message', e.data) }
  window._gnome_ws = ws
})()
EOF

cat > frontend/src/styles.css <<'EOF'
body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 0; padding: 0; }
.app { padding: 1rem; }
.terminal-container { width: 100%; height: 600px; border: 1px solid #ccc; background: #000; }
EOF

# nginx config
cat > nginx/nginx.conf <<'EOF'
worker_processes  1;

events {
  worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name _;

        location / {
            root /usr/share/nginx/html;
            try_files $uri /index.html;
        }

        location /ws {
            proxy_pass http://backend:8765;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
        }
    }
}
EOF

# docs/DEPLOYMENT.md
cat > docs/DEPLOYMENT.md <<'EOF'
# Deployment checklist and examples

- Ports: backend listens on 8765. Make sure this port is accessible by the reverse proxy only.
- systemd service (example):

[Unit]
Description=gnome-terminal-clone backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/srv/gnome-terminal-clone
ExecStart=/srv/gnome-terminal-clone/.venv/bin/python backend/server.py
Restart=on-failure

[Install]
WantedBy=multi-user.target

- TLS: use certbot or managed certificates at the proxy layer. Ensure WebSocket proxying preserves Upgrade headers.
- Security: do not expose the PTY backend without authentication. Implement an auth layer or proxy with authentication.
EOF

echo "Created files. To commit and push:"
echo "  git checkout -b add-terminal-sample"
echo "  git add ."
echo "  git commit -m \"Add terminal backend/frontend and hosting configs\""
echo "  git push -u origin add-terminal-sample"
