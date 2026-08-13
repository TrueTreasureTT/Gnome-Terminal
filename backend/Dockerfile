# backend/Dockerfile
FROM python:3.11-slim

# Create non-root user
RUN useradd --create-home --shell /bin/bash worker
WORKDIR /home/worker

# Install runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and server
COPY requirements.txt /home/worker/requirements.txt
RUN pip install --no-cache-dir -r /home/worker/requirements.txt

# Copy app
COPY . /home/worker/
RUN chown -R worker:worker /home/worker

USER worker
ENV PATH="/home/worker/.local/bin:${PATH}"

EXPOSE 8765
CMD ["python", "backend/server.py"]
