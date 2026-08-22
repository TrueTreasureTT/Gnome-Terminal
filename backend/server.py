#!/usr/bin/env python3
"""WebSocket <-> PTY bridge for the browser Ubuntu-style terminal."""
import asyncio
import json
import os
import signal
import struct
import fcntl
import termios

import websockets

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8765"))
DEFAULT_CWD = os.environ.get("DEFAULT_CWD", os.path.expanduser("~"))
DEFAULT_SHELL = os.environ.get("DEFAULT_SHELL", os.environ.get("SHELL", "/bin/bash"))
AUTH_TOKEN = os.environ.get("AUTH_TOKEN", "")


def set_pty_winsize(fd: int, rows: int, cols: int) -> None:
    rows = max(1, min(int(rows), 500))
    cols = max(1, min(int(cols), 500))
    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))


def authorized(ws, path=None) -> bool:
    if not AUTH_TOKEN:
        return True
    token = ""
    if path and "?" in path:
        for item in path.split("?", 1)[1].split("&"):
            key, _, value = item.partition("=")
            if key == "token":
                token = value
                break
    auth = ws.request_headers.get("Authorization", "")
    return token == AUTH_TOKEN or auth == f"Bearer {AUTH_TOKEN}"


async def handler(ws, path=None):
    if not authorized(ws, path):
        await ws.close(code=4003, reason="unauthorized")
        return

    loop = asyncio.get_running_loop()
    pid, fd = os.forkpty()

    if pid == 0:
        env = os.environ.copy()
        env.update({
            "TERM": "xterm-256color",
            "COLORTERM": "truecolor",
            "TERM_PROGRAM": "GNOME Terminal",
            "SHELL": DEFAULT_SHELL,
            "LANG": env.get("LANG", "C.UTF-8"),
            "LC_ALL": env.get("LC_ALL", "C.UTF-8"),
        })

        cwd = DEFAULT_CWD if os.path.isdir(DEFAULT_CWD) else env.get("HOME", os.path.expanduser("~"))
        try:
            os.chdir(cwd)
        except OSError:
            pass

        try:
            os.execvpe(DEFAULT_SHELL, [DEFAULT_SHELL, "-l"], env)
        except OSError:
            os._exit(127)

    os.set_blocking(fd, False)

    def pty_readable():
        try:
            data = os.read(fd, 16384)
            if data:
                asyncio.create_task(ws.send(data))
            else:
                asyncio.create_task(ws.close())
        except (OSError, ValueError):
            asyncio.create_task(ws.close())

    loop.add_reader(fd, pty_readable)

    try:
        async for message in ws:
            if isinstance(message, (bytes, bytearray)):
                try:
                    os.write(fd, message)
                except OSError:
                    break
                continue

            try:
                obj = json.loads(message)
            except json.JSONDecodeError:
                try:
                    os.write(fd, message.encode())
                except OSError:
                    break
                continue

            typ = obj.get("type")
            if typ == "resize":
                set_pty_winsize(fd, obj.get("rows", 24), obj.get("cols", 80))
            elif typ == "signal":
                sig = {"INT": signal.SIGINT, "TERM": signal.SIGTERM, "HUP": signal.SIGHUP}.get(obj.get("signal"))
                if sig:
                    try:
                        os.killpg(pid, sig)
                    except ProcessLookupError:
                        pass
            elif typ == "cwd":
                cwd = obj.get("cwd")
                if isinstance(cwd, str) and cwd:
                    os.write(fd, f"cd -- {json.dumps(cwd)}\n".encode())
            elif typ == "env":
                key = obj.get("key")
                value = obj.get("value")
                if key in {"TERM", "COLORTERM"} and isinstance(value, str):
                    os.write(fd, f"export {key}={json.dumps(value)}\n".encode())
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
    async with websockets.serve(
        handler,
        HOST,
        PORT,
        max_size=None,
        ping_interval=20,
        ping_timeout=20,
    ):
        print(f"Ubuntu-style terminal PTY server listening on ws://{HOST}:{PORT}")
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
