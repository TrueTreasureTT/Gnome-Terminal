# nginx/Dockerfile
# Multi-stage: build frontend with Node, copy dist into nginx image, include nginx.conf that proxies /ws to backend

FROM node:18-alpine AS build
WORKDIR /app
# Copy frontend sources
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY frontend/tsconfig.json ./frontend/tsconfig.json
COPY frontend/src ./frontend/src
COPY frontend/public ./frontend/public
WORKDIR /app/frontend
RUN npm ci --silent
RUN npm run build

FROM nginx:stable-alpine
# Remove default conf and add ours
RUN rm /etc/nginx/conf.d/default.conf || true
COPY nginx.conf /etc/nginx/nginx.conf
# Copy built frontend
COPY --from=build /app/frontend/dist /usr/share/nginx/html
# Expose 80 (and 443 if you add TLS certs)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
