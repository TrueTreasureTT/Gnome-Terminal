#!/usr/bin/env python3
"""
WebSocket <-> PTY bridge
- Reads PORT from env (default 8765) so it works on PaaS like Render.
- Accepts JSON control messages for resize, env, cwd.
- Uses binary frames for PTY I/O.
Security: This is a minimal demo. Do NOT expose without authentication and sandboxing.
"""
import asyncio
import json
import os
import signal
import sys
import websockets
from backend.pty_handler import set_pty_winsize

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "8765"))
DEFAULT_CWD = os.environ.get("DEFAULT_CWD", "/home/worker/repo")
DEFAULT_SHELL = os.environ.get("SHELL", "/bin/bash")
DEFAULT_TERM = os.environ.get("TERM", "xterm-256color")

async def handler(ws, path):
    """
    WS message handling:
    - binary frames: forwarded directly to the PTY (os.write(fd, bytes))
    - text frames: JSON control messages, e.g. {"type":"resize","cols":80,"rows":24}
                  {"type":"env","key":"TERM","value":"xterm-256color"}
                  {"type":"cwd","cwd":"/path/to/repo"}
    """
    loop = asyncio.get_running_loop()

    # allow path query param ?cwd=... (optional, naive parsing)
    cwd = DEFAULT_CWD
    try:
        if path and "?" in path:
            q = path.split("?", 1)[1]
            for part in q.split("&"):
                k, _, v = part.partition("=")
                if k == "cwd" and v:
                    cwd = v
    except Exception:
        pass

    pid, fd = os.forkpty()
    if pid == 0:
        # Child: set up environment and exec shell
        try:
            os.environ["TERM"] = os.environ.get("TERM", DEFAULT_TERM)
            if cwd:
                try:
                    os.chdir(cwd)
                except Exception:
                    # ignore chdir failure, child will continue
                    pass
            # exec shell
            os.execv(DEFAULT_SHELL, [DEFAULT_SHELL])
        except Exception:
            # On failure in the child, make sure to exit so parent can handle it.
            sys.exit(1)
    else:
        # Parent: proxy between fd and websocket
        os.set_blocking(fd, False)

        def pty_readable():
            try:
                data = os.read(fd, 4096)
            except OSError:
                data = b""
            if data:
                # Send binary frame
                try:
                    asyncio.create_task(ws.send(data))
                except Exception:
                    pass
            else:
                # EOF from pty -> close ws
                asyncio.create_task(ws.close())

        loop.add_reader(fd, pty_readable)

        try:
            async for message in ws:
                # websockets library presents binary frames as 'bytes' and text frames as 'str'
                if isinstance(message, (bytes, bytearray)):
                    try:
                        os.write(fd, message)
                    except BrokenPipeError:
                        # PTY closed
                        await ws.close()
                        break
                else:
                    # Text control messages (JSON) or raw text typed by client
                    try:
                        obj = json.loads(message)
                        typ = obj.get("type")
                        if typ == "resize":
                            cols = int(obj.get("cols", 80))
                            rows = int(obj.get("rows", 24))
                            set_pty_winsize(fd, rows, cols)
                        elif typ == "env":
                            # optionally set an env var for the child process BEFORE spawn
                            # Note: changing parent env won't affect already-spawned child,
                            # but we support using this message prior to spawning the shell in some flows.
                            key = obj.get("key")
                            val = obj.get("value")
                            if key and val:
                                os.environ[key] = val
                        elif typ == "cwd":
                            # attempt to chdir the pty master side has no effect on child,
                            # but we support receiving cwd before spawning when used in handshake.
                            newcwd = obj.get("cwd")
                            if newcwd:
                                try:
                                    os.chdir(newcwd)
                                except Exception:
                                    pass
                        else:
                            # fallback: write the text as keystrokes
                            os.write(fd, message.encode())
                    except json.JSONDecodeError:
                        # Not a JSON control message; write as keystrokes
                        try:
                            os.write(fd, message.encode())
                        except BrokenPipeError:
                            await ws.close()
                            break
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            loop.remove_reader(fd)
            # try to terminate child process
            try:
                os.kill(pid, signal.SIGHUP)
            except Exception:
                pass

async def main():
    async with websockets.serve(handler, HOST, PORT, max_size=None, ping_interval=None):
        print(f"WS PTY server running on ws://{HOST}:{PORT}/")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
