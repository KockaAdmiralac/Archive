from enums import CheckerEvent

pygame = None

def init(**kwargs):
    global pygame
    if kwargs['pygame']:
        pygame = kwargs['pygame']
    else:
        raise EnvironmentError('Don\'t call initialization functions directly. Use pygame.init instead.')

def set_caption(caption):
    global pygame
    if pygame is None:
        raise EnvironmentError('pygame.display not initialized.')
    pygame.send_to_runner(CheckerEvent.SET_CAPTION, caption)

def set_mode(resolution=(0, 0), flags=0, depth=0):
    global pygame
    if pygame is None:
        raise EnvironmentError('pygame.display not initialized.')
    pygame.send_to_runner(CheckerEvent.SET_MODE, resolution, flags, depth)
    return pygame.Surface(resolution, flags, depth)

def update():
    global pygame
    if pygame is None:
        raise EnvironmentError('pygame.display not initialized.')
    pygame.send_to_runner(CheckerEvent.UPDATE)
