import fcntl
import termios
import struct

def set_pty_winsize(fd, rows, cols):
    """
    rows, cols: ints
    """
    winsize = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)
