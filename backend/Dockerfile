# Ubuntu 26.04 LTS userspace for the web terminal
FROM ubuntu:26.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    ca-certificates \
    bash \
    coreutils \
    util-linux \
    procps \
    iproute2 \
    iputils-ping \
    curl \
    wget \
    git \
    nano \
    vim-tiny \
    less \
    sudo \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash worker \
    && mkdir -p /home/worker/repo \
    && chown -R worker:worker /home/worker

WORKDIR /home/worker

COPY requirements.txt /home/worker/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r /home/worker/requirements.txt

COPY server.py /home/worker/server.py
RUN chown worker:worker /home/worker/server.py

USER worker
ENV HOME=/home/worker \
    USER=worker \
    LOGNAME=worker \
    SHELL=/bin/bash \
    PATH="/opt/venv/bin:/home/worker/.local/bin:${PATH}"

EXPOSE 8765
CMD ["/opt/venv/bin/python", "/home/worker/server.py"]
