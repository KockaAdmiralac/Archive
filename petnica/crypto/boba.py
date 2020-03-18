from collections import Counter
from parameters import *

def encode(c):
    if c == ' ':
        return 26
    else:
        return ord(c) - ord('a')

def decode(n):
    if n == 26:
        return ' '
    else:
        return chr(n + ord('a'))

if __name__ == '__main__':
    print([encode(c) for c in word4])
    print(''.join([decode(n) for n in encoded4]))
    print(len(hint4), len(C4))
    # ints4 = [encode(c) for c in text4]
    # C4[i] = Q4c[ints4[i]]
    #        a   b   c  d   e   f  g  h  i   j   k  l   m   n   o   p   q   r   s   t  u    v   w  x  y  z    
    hint4 = [25, 23, 9, 4, 16, 3, 7, 2, 24, 20, 5, 11, 15, 22, 18, 14, 12, 13, 26, 10, 17, 19, 6, 8, 0, 1, 21]
    d = {}
    print(hint4)
    for i in range(len(hint4)):
        if hint4[i] != -1:
            d[hint4[i]] = decode(i)
    print(d)
    for i in range(len(C4)):
        if C4[i] in d:
            print(d[C4[i]], end='')
        else:
            print('<{0}>'.format(C4[i]), end='')
    print('')
    print(Counter(C4))
