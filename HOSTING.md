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
- Use TLS termination (Let’s Encrypt or managed certs) on the load balancer or nginx.

3) Kubernetes
- Containerize frontend and backend (Dockerfile included).
- Use an Ingress controller that supports WebSockets (nginx-ingress, Traefik).

Important security notes
- Always use TLS (wss://) for WebSocket connections over the public internet.
- Authenticate users before allowing access to a PTY.
- Run the PTY session under a restricted user; consider containerizing per-session.
- Limit session lifetime and log commands if required by audit policy.
