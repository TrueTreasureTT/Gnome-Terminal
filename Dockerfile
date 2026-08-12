# Simple Dockerfile for backend + static frontend

# Backend image
FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
EXPOSE 8765
CMD ["python", "backend/server.py"]
