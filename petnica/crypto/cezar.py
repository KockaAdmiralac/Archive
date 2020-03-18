import os
from PyDictionary import PyDictionary
from threading import Lock, Thread

d = PyDictionary()
score = 0
lock = Lock()

def shiftc(c, num):
    c += num
    if c >= 26:
        return c - 26
    if c < 0:
        return -1
    else:
        return c

def thread_do(word):
    global score
    if d.meaning(word):
        with lock:
            score += 1

for filename in os.listdir('caesar_data'):
    print('Doing {0}...'.format(filename))
    with open('caesar_data/{0}'.format(filename)) as f:
        text = f.readlines()[0]
        mscore = 0
        mi = 0
        mtext = ''
        for i in range(26):
            t = []
            for c in text:
                if c == ' ' or c == '.':
                    t.append(c)
                elif c.upper() == c:
                    code = shiftc(ord(c) - ord('A'), i)
                    t.append(chr(code + ord('A')))
                else:
                    code = shiftc(ord(c) - ord('a'), i)
                    t.append(chr(code + ord('a')))
            score = 0
            threads = []
            words = ''.join(t).split(' ')
            for i in range(15):
                thr = Thread(target=thread_do, args=(words[i],))
                threads.append(thr)
                thr.start()
            for thr in threads:
                thr.join()
            if score > mscore:
                mscore = score
                mi = i
                mtext = ''.join(t)
        with open('caesar_result/{0}'.format(filename), 'w+') as wf:
            wf.write(mtext)
