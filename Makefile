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
