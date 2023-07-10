from checkerlib import BaseChecker, CheckerCondition
from enums import CheckerConditionResult, CheckerEvent, CheckerDrawEvent

class Checker(BaseChecker):
    def __init__(self):
        super().__init__(conditions = [
            CheckerCondition(inline=self.is_initialized),
            CheckerCondition(inline=self.set_caption),
            CheckerCondition(inline=self.set_mode),
            CheckerCondition(inline=self.fill),
            CheckerCondition(inline=self.draw),
            CheckerCondition(inline=self.update),
            CheckerCondition(inline=self.wait),
            CheckerCondition(inline=self.quit)
        ])

    def is_initialized(self, event, *args):
        if event == CheckerEvent.INIT:
            return CheckerConditionResult.CORRECT
        return CheckerConditionResult.SKIP

    def set_caption(self, event, *args):
        if event == CheckerEvent.SET_CAPTION:
            if args[0] == 'Pygame':
                return CheckerConditionResult.CORRECT
            else:
                return CheckerConditionResult.FAIL
        return CheckerConditionResult.SKIP

    def set_mode(self, event, *args):
        if event == CheckerEvent.SET_MODE:
            tup = args[0]
            if not isinstance(tup, list):
                return CheckerConditionResult.FAIL
            if tup[0] == 400 and tup[1] == 400:
                return CheckerConditionResult.CORRECT
            return CheckerConditionResult.FAIL
        return CheckerConditionResult.SKIP

    def fill(self, event, *args):
        if event == CheckerEvent.FILL:
            color = args[0]
            if color['value'] == 'white':
                return CheckerConditionResult.CORRECT
            return CheckerConditionResult.FAIL
        return CheckerConditionResult.SKIP

    def draw(self, event, *args):
        if event == CheckerEvent.DRAW:
            if args[0] == CheckerDrawEvent.LINE:
                print(args[1])
                if (
                    isinstance(args[1], dict) and
                    args[1]['width'] == 400 and
                    args[1]['height'] == 400 and
                    args[2]['value'] == 'black' and
                    isinstance(args[3], list) and
                    args[3][0] == 100 and
                    args[3][1] == 100 and
                    isinstance(args[4], list) and
                    args[4][0] == 300 and
                    args[4][1] == 300 and
                    args[5] == 5
                ):
                    return CheckerConditionResult.CORRECT
            return CheckerConditionResult.FAIL
        return CheckerConditionResult.SKIP

    def update(self, event, *args):
        if event == CheckerEvent.UPDATE:
            return CheckerConditionResult.CORRECT
        # We expect an update to be called right after a draw.
        return CheckerConditionResult.FAIL

    def wait(self, event, *args):
        if event == CheckerEvent.WAIT:
            if args[0] == 5000:
                return CheckerConditionResult.CORRECT
            return CheckerConditionResult.FAIL
        return CheckerConditionResult.SKIP

    def quit(self, event, *args):
        if event == CheckerEvent.QUIT:
            print('pass quit')
            return CheckerConditionResult.CORRECT
        return CheckerConditionResult.SKIP
