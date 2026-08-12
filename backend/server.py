"""Simple WebSocket -> PTY bridge

Usage: python backend/server.py

This starts a WebSocket server on port 8765 and spawns a shell in a PTY per connection.
"""
import asyncio
import os
import fcntl
import termios
import struct
import signal
import sys
import websockets
from backend.pty_handler import set_pty_winsize

HOST = '0.0.0.0'
PORT = 8765

async def handler(ws, path):
    loop = asyncio.get_running_loop()
    pid, fd = os.forkpty()
    if pid == 0:
        # Child: exec the user's shell
        shell = os.environ.get('SHELL', '/bin/bash')
        os.execv(shell, [shell])
    else:
        # Parent: forward data
        os.set_blocking(fd, False)

        def fd_to_ws():
            try:
                data = os.read(fd, 1024)
                if data:
                    asyncio.create_task(ws.send(data))
                else:
                    # EOF
                    asyncio.create_task(ws.close())
            except OSError:
                asyncio.create_task(ws.close())

        loop.add_reader(fd, fd_to_ws)

        try:
            async for msg in ws:
                # Control message for resizing: b"RESIZE:cols,rows"
                if isinstance(msg, (bytes, bytearray)):
                    os.write(fd, msg)
                else:
                    if msg.startswith('RESIZE:'):
                        try:
                            _, dims = msg.split(':', 1)
                            cols, rows = dims.split(',')
                            set_pty_winsize(fd, int(rows), int(cols))
                        except Exception:
                            pass
                    else:
                        os.write(fd, msg.encode())
        finally:
            loop.remove_reader(fd)
            try:
                os.kill(pid, signal.SIGHUP)
            except Exception:
                pass

async def main():
    async with websockets.serve(handler, HOST, PORT, max_size=None, ping_interval=None):
        print(f"WebSocket PTY server running on ws://{HOST}:{PORT}/")
        await asyncio.Future()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
