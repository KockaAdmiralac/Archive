from enum import IntEnum
from os import scandir
from typing import Dict, List

class Answer(IntEnum):
    TRUE_POSITIVE = 1
    FALSE_POSITIVE = 2
    TRUE_NEGATIVE = 3
    FALSE_NEGATIVE = 4

class Question:
    correct_answer: bool
    confidence: int
    id: int
    
    def __init__(self, confidence: int, correct_answer: bool, id: int) -> None:
        self.confidence = confidence
        self.correct_answer = correct_answer
        self.id = id

    def correct(self, threshold: float) -> Answer:
        if self.correct_answer:
            if self.confidence >= threshold:
                return Answer.TRUE_POSITIVE
            else:
                return Answer.FALSE_NEGATIVE
        else:
            if self.confidence >= threshold:
                return Answer.FALSE_POSITIVE
            else:
                return Answer.TRUE_NEGATIVE


wpa: Dict[int, int] = {}
ca: Dict[int, bool] = {}
questions: List[Question] = []
p = 0
n = 0

def scan(dir: str) -> None:
    global p
    global n
    for entry in scandir(dir):
        if entry.is_dir():
            scan(entry.path)
        elif entry.is_file():
            if entry.name.startswith('wpa') and entry.name.endswith('.txt'):
                with open(entry.path) as file:
                    wpa[int(entry.name[3:-4])] = int(file.readline().strip()[:-1])
            elif entry.name.startswith('ca') and entry.name.endswith('.txt'):
                with open(entry.path) as file:
                    correct = file.readline().strip().lower() == 'yes'
                    if correct:
                        p += 1
                    else:
                        n += 1
                    ca[int(entry.name[2:-4])] = correct
            else:
                print('Unhandled files, whoops')
        else:
            print('Uhh we need to handle symlinks but we do not')

scan(input())
pv = 0
nv = 0
tp70 = 0
fp70 = 0
for key, value in wpa.items():
    if key in ca:
        if ca[key]:
            pv += 1
        else:
            nv += 1
        q = Question(value, ca[key], key)
        questions.append(q)
        answer70 = q.correct(70)
        if answer70 == Answer.TRUE_POSITIVE:
            tp70 += 1
        elif answer70 == Answer.FALSE_POSITIVE:
            fp70 += 1
tpr70 = tp70 / pv
fpr70 = fp70 / nv

eer = 0
eer_diff = 2
guess = 0.0
while guess <= 100:
    tp = 0
    fp = 0
    for question in questions:
        answer = question.correct(guess)
        if answer == Answer.TRUE_POSITIVE:
            tp += 1
        elif answer == Answer.FALSE_POSITIVE:
            fp += 1
    tpr = tp / pv
    fpr = fp / nv
    diff = abs(1 - tpr - fpr)
    if eer_diff > diff:
        eer_diff = diff
        eer = fpr
    guess += 0.1

print(','.join([str(x) for x in [p, n, len(questions), tpr70, fpr70, eer]]))
