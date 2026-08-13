# inside your handler (simplified)
import json
import os
import signal
import sys
import asyncio
import websockets
from backend.pty_handler import set_pty_winsize

async def handler(ws, path):
    # path may include query like /?cwd=/app/repo
    # parse cwd from query if you want to allow remote selection
    cwd = None
    if '?' in path:
        q = path.split('?', 1)[1]
        for part in q.split('&'):
            k, _, v = part.partition('=')
            if k == 'cwd':
                cwd = v

    pid, fd = os.forkpty()
    if pid == 0:
        # child process: set TERM and optionally change cwd
        os.environ['TERM'] = os.environ.get('TERM', 'xterm-256color')
        if cwd:
            try:
                os.chdir(cwd)
            except Exception:
                pass
        # Optionally preserve PATH or other env vars
        shell = os.environ.get('SHELL', '/bin/bash')
        os.execv(shell, [shell])
    else:
        loop = asyncio.get_running_loop()
        os.set_blocking(fd, False)

        def read_fd():
            try:
                data = os.read(fd, 4096)
                if data:
                    # send raw bytes to client
                    asyncio.create_task(ws.send(data))
                else:
                    asyncio.create_task(ws.close())
            except OSError:
                asyncio.create_task(ws.close())

        loop.add_reader(fd, read_fd)

        try:
            async for message in ws:
                # 'message' can be bytes or str; websockets library gives bytes for binary frames
                if isinstance(message, (bytes, bytearray)):
                    # forward bytes directly to the PTY
                    os.write(fd, message)
                else:
                    # text control messages as JSON: {"type":"resize","cols":80,"rows":24}
                    try:
                        obj = json.loads(message)
                        if obj.get('type') == 'resize':
                            set_pty_winsize(fd, int(obj['rows']), int(obj['cols']))
                        # other control types can go here
                    except Exception:
                        # fallback: write text to PTY (keystrokes)
                        os.write(fd, message.encode())
        finally:
            loop.remove_reader(fd)
            try:
                os.kill(pid, signal.SIGHUP)
            except Exception:
                pass
