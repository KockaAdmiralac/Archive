from enum import IntEnum

class CheckerEvent(IntEnum):
    OUTPUT = 0
    SET_CAPTION = 1
    SET_MODE = 2
    FILL = 3
    DRAW = 4
    UPDATE = 5
    WAIT = 6
    INIT = 7
    QUIT = 8

class CheckerDrawEvent(IntEnum):
    LINE = 0

class CheckerConditionResult(IntEnum):
    FAIL = 0
    SKIP = 1
    CORRECT = 2

class CheckerConditionMethod(IntEnum):
    AND = 0
    OR = 1

class CheckerResult(IntEnum):
    FAILED = -1
    CONTINUE = 0
    SUCCEEDED = 1
