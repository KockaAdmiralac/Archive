from enums import CheckerEvent

pygame = None

def init(**kwargs):
    global pygame
    if kwargs['pygame']:
        pygame = kwargs['pygame']
    else:
        raise EnvironmentError('Don\'t call initialization functions directly. Use pygame.init instead.')

def wait(milliseconds):
    global pygame
    if pygame is None:
        raise EnvironmentError('pygame.draw not initialized.')
    pygame.send_to_runner(CheckerEvent.WAIT, milliseconds)
