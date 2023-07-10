from collections import deque
from enums import CheckerConditionMethod, CheckerConditionResult, CheckerResult

class CheckerCondition():
    def __init__(self, inline=None, conditions=[], method=CheckerConditionMethod.AND):
        self.inline = inline
        self.method = method
        self.conditions = conditions

    def result_for(self, event, *args):
        if self.inline is not None:
            return self.inline(event, *args)
        else:
            succeeded = False
            for condition in self.conditions:
                result = condition.result_for(event, *args)
                if self.method == CheckerConditionMethod.AND and result == CheckerConditionResult.FAIL:
                    return CheckerConditionResult.FAIL
                if self.method == CheckerConditionMethod.OR and result == CheckerConditionResult.CORRECT:
                    succeeded = True
                    break
            if not succeeded and self.method == CheckerConditionMethod.OR:
                return CheckerConditionResult.FAIL
            return CheckerConditionResult.SKIP

class BaseChecker:
    def __init__(self, conditions=[]):
        self.conditions = deque(conditions)

    def event(self, event, *args):
        while len(self.conditions) > 0:
            result = self.conditions[0].result_for(event, *args)
            if result == CheckerConditionResult.FAIL:
                return CheckerResult.FAILED
            elif result == CheckerConditionResult.CORRECT:
                self.conditions.popleft()
            if len(self.conditions) == 0:
                return CheckerResult.SUCCEEDED
            return CheckerResult.CONTINUE
        return CheckerResult.SUCCEEDED
