#!/usr/bin/env python3
"""WebSocket <-> PTY bridge running an Ubuntu 26.04-style shell."""
import asyncio
import json
import os
import signal
import struct
import fcntl
import termios
import websockets

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "8765"))
DEFAULT_CWD = os.environ.get("DEFAULT_CWD", "/home/worker")
DEFAULT_SHELL = os.environ.get("SHELL", "/bin/bash")
AUTH_TOKEN = os.environ.get("AUTH_TOKEN", "")


def set_pty_winsize(fd, rows, cols):
    winsize = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)


async def handler(ws, path=None):
    if AUTH_TOKEN:
        token = ""
        try:
            query = path.split("?", 1)[1] if path and "?" in path else ""
            for item in query.split("&"):
                key, _, value = item.partition("=")
                if key == "token":
                    token = value
        except Exception:
            pass
        auth = ws.request_headers.get("Authorization", "")
        if token != AUTH_TOKEN and auth != f"Bearer {AUTH_TOKEN}":
            await ws.close(code=4003, reason="unauthorized")
            return

    loop = asyncio.get_running_loop()
    pid, fd = os.forkpty()

    if pid == 0:
        os.environ.update({
            "TERM": "xterm-256color",
            "COLORTERM": "truecolor",
            "HOME": "/home/worker",
            "USER": "worker",
            "LOGNAME": "worker",
            "SHELL": DEFAULT_SHELL,
            "LANG": os.environ.get("LANG", "C.UTF-8"),
            "TERM_PROGRAM": "GNOME Terminal",
        })
        try:
            os.chdir(DEFAULT_CWD)
        except OSError:
            os.chdir("/home/worker")
        os.execv(DEFAULT_SHELL, [DEFAULT_SHELL, "-l"])
        os._exit(1)

    os.set_blocking(fd, False)

    def pty_readable():
        try:
            data = os.read(fd, 16384)
            if data:
                asyncio.create_task(ws.send(data))
            else:
                asyncio.create_task(ws.close())
        except OSError:
            asyncio.create_task(ws.close())

    loop.add_reader(fd, pty_readable)

    try:
        async for message in ws:
            if isinstance(message, (bytes, bytearray)):
                os.write(fd, message)
                continue

            try:
                obj = json.loads(message)
            except json.JSONDecodeError:
                os.write(fd, message.encode())
                continue

            typ = obj.get("type")
            if typ == "resize":
                set_pty_winsize(fd, int(obj.get("rows", 24)), int(obj.get("cols", 80)))
            elif typ == "env":
                key, value = obj.get("key"), obj.get("value")
                if key and value:
                    # Environment changes are applied to future shell commands only.
                    os.environ[key] = value
            elif typ == "cwd":
                cwd = obj.get("cwd")
                if cwd:
                    os.write(fd, f"cd -- {json.dumps(cwd)}\n".encode())
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        loop.remove_reader(fd)
        try:
            os.kill(pid, signal.SIGHUP)
        except ProcessLookupError:
            pass
        try:
            os.close(fd)
        except OSError:
            pass


async def main():
    async with websockets.serve(handler, HOST, PORT, max_size=None, ping_interval=20):
        print(f"Ubuntu terminal PTY server running on ws://{HOST}:{PORT}/ws")
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
