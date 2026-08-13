#!/usr/bin/env python3
"""
WebSocket <-> PTY bridge with simple token auth.

Auth:
 - If AUTH_TOKEN env is set, a connecting client MUST provide it either:
   - as query parameter: ws://host/ws?token=THE_TOKEN
   - or as an Authorization header: Authorization: Bearer THE_TOKEN

Control messages (JSON text frames):
 - {"type":"resize","cols":80,"rows":24}
 - {"type":"env","key":"TERM","value":"xterm-256color"}
 - {"type":"cwd","cwd":"/path/to/repo"}

Binary frames are forwarded to the PTY and binary output is sent back.
"""
import asyncio
import json
import os
import signal
import sys
import websockets
from urllib.parse import urlparse, parse_qs
from backend.pty_handler import set_pty_winsize

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "8765"))
DEFAULT_CWD = os.environ.get("DEFAULT_CWD", "/home/worker/repo")
DEFAULT_SHELL = os.environ.get("SHELL", "/bin/bash")
DEFAULT_TERM = os.environ.get("TERM", "xterm-256color")
AUTH_TOKEN = os.environ.get("AUTH_TOKEN", "")  # if empty, auth disabled (for local only)

async def handler(ws, path):
    # Simple auth: check query param or Authorization header
    if AUTH_TOKEN:
        # Query param
        try:
            parsed = urlparse(path)
            qs = parse_qs(parsed.query)
            token_ok = False
            if "token" in qs and qs["token"] and qs["token"][0] == AUTH_TOKEN:
                token_ok = True
            # Header fallback
            auth_header = ws.request_headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                if auth_header.split(" ", 1)[1] == AUTH_TOKEN:
                    token_ok = True
            if not token_ok:
                try:
                    await ws.send(json.dumps({"type":"error","message":"unauthorized"}))
                except Exception:
                    pass
                await ws.close(code=4003, reason="unauthorized")
                return
        except Exception:
            await ws.close(code=4003, reason="auth-check-failed")
            return

    # Default working dir (can be overridden by control msg before spawn if you implement handshake)
    cwd = DEFAULT_CWD

    loop = asyncio.get_running_loop()
    pid, fd = os.forkpty()
    if pid == 0:
        # Child: set environment and chdir
        try:
            os.environ["TERM"] = os.environ.get("TERM", DEFAULT_TERM)
            if cwd:
                try:
                    os.chdir(cwd)
                except Exception:
                    pass
            os.execv(DEFAULT_SHELL, [DEFAULT_SHELL])
        except Exception:
            sys.exit(1)
    else:
        os.set_blocking(fd, False)

        def pty_readable():
            try:
                data = os.read(fd, 4096)
            except OSError:
                data = b""
            if data:
                # forward as binary
                try:
                    asyncio.create_task(ws.send(data))
                except Exception:
                    pass
            else:
                asyncio.create_task(ws.close())

        loop.add_reader(fd, pty_readable)

        try:
            async for message in ws:
                if isinstance(message, (bytes, bytearray)):
                    try:
                        os.write(fd, message)
                    except BrokenPipeError:
                        await ws.close()
                        break
                else:
                    # text message: try JSON control
                    try:
                        obj = json.loads(message)
                        typ = obj.get("type")
                        if typ == "resize":
                            set_pty_winsize(fd, int(obj.get("rows", 24)), int(obj.get("cols", 80)))
                        elif typ == "env":
                            k = obj.get("key")
                            v = obj.get("value")
                            if k and v:
                                os.environ[k] = v
                        elif typ == "cwd":
                            newcwd = obj.get("cwd")
                            if newcwd:
                                try:
                                    os.chdir(newcwd)
                                except Exception:
                                    pass
                        else:
                            # fallback: send text to pty as keystrokes
                            os.write(fd, message.encode())
                    except json.JSONDecodeError:
                        try:
                            os.write(fd, message.encode())
                        except BrokenPipeError:
                            await ws.close()
                            break
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            loop.remove_reader(fd)
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
