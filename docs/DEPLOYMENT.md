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
