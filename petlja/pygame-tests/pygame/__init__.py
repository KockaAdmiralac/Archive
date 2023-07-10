# Unsupported:
#   - Overlay
#   - cdrom
#   - examples
#   - joystick
#   - tests

__all__ = [
    'cursors',
    'display',
    'draw',
    'event',
    'font',
    'freetype',
    'gfxdraw',
    'image',
    'key',
    'locals',
    'mixer',
    'scrap',
    'sndarray',
    'time',
    'transform'
]
from enums import CheckerEvent
import json
import pygame.display
import pygame.draw
import pygame.time
import sys
_nonce = input()

class BufferProxy:
    def __init__(self):
        pass

class Color:
    def __init__(self, value):
        self.value = value

class PixelArray:
    def __init__(self):
        pass

class Rect:
    def __init__(self, *args):
        if len(args) == 4:
            self.left, self.top, self.width, self.height = args
        elif len(args) == 2:
            self.left, self.top = args[0]
            self.width, self.height = args[1]

class Surface:
    def __init__(self, resolution, flags=0, depth=0, masks=None):
        self.width = resolution[0]
        self.height = resolution[1]
        self.flags = flags
        self.depth = depth

    def fill(self, color, rect=None, special_flags=0):
        send_to_runner(CheckerEvent.FILL, color, rect, special_flags)

def init():
    send_to_runner(CheckerEvent.INIT)
    me = sys.modules[__name__]
    pygame.display.init(pygame=me)
    pygame.draw.init(pygame=me)
    pygame.time.init(pygame=me)

def quit():
    send_to_runner(CheckerEvent.QUIT)

def error():
    pass

def get_error():
    pass

def set_error():
    pass

def get_sdl_version():
    return (0, 0, 0)

def get_sdl_byteorder():
    return -1

def register_quit(callback):
    pass

# Not supported:
#   - encode_string
#   - encode_file_path

def send_to_runner(*data):
    print('<pygame-to-runner nonce="{0}">{1}</pygame-to-runner>'.format(_nonce, json.dumps(data, default=lambda obj: obj.__dict__)))
