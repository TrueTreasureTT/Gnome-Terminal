# Build the Vite frontend, then serve it with nginx and proxy the PTY WebSocket.
FROM node:20-alpine AS build
WORKDIR /app/frontend

COPY frontend/package.json ./
COPY frontend/tsconfig.json ./
COPY frontend/src ./src
COPY frontend/public ./public

RUN npm install --no-audit --no-fund
RUN npm run build

FROM nginx:stable-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
