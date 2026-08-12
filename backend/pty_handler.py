import fcntl
import termios
import struct

# Helper to set window size on a pty fd

def set_pty_winsize(fd, rows, cols):
    # struct winsize: unsigned short ws_row, ws_col, ws_xpixel, ws_ypixel
    winsize = struct.pack('HHHH', rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)
