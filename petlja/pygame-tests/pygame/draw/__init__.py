from enums import CheckerDrawEvent, CheckerEvent

pygame = None

def init(**kwargs):
    global pygame
    if kwargs['pygame']:
        pygame = kwargs['pygame']
    else:
        raise EnvironmentError('Don\'t call initialization functions directly. Use pygame.init instead.')

def line(surface, color, start_pos, end_pos, width=1):
    global pygame
    if pygame is None:
        raise EnvironmentError('pygame.draw not initialized.')
    pygame.send_to_runner(CheckerEvent.DRAW, CheckerDrawEvent.LINE, surface, color, start_pos, end_pos, width)
