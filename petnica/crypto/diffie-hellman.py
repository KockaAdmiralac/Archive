# encoding: utf-8
from random import randint
from sage.all import *
from sage.matrix.matrix2 import Matrix

# power_mod(g, p-1, p) == 1
# power_mod(g, d, p) != 1

def generate(x, p):
    first = rest = mod(x, p)
    found = []
    found.append(first)
    while True:
        m = mod(x * rest, p)
        if m == first:
            break
        else:
            rest = m
            found.append(m)
    found.sort()
    return found

def random_generator(p):
    while True:
        i = randint(1, p - 1)
        if len(generate(i, p)) == p - 1:
            return i

def diffie_hellman(g, p):
    a = randint(1, p - 1)
    b = randint(1, p - 1)
    ga = power_mod(g, a, p)
    gb = power_mod(g, b, p)
    return power_mod(ga, b, p) == power_mod(gb, a, p)

p = 7
g = random_generator(p)
print(g)
print(diffie_hellman(g, p))
