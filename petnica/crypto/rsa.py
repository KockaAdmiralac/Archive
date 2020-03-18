# encoding: utf-8
from random import randint
from sage.all import *
from sage.matrix.matrix2 import Matrix

LOWER_PRIME_BOUND = 10 ** 3
UPPER_PRIME_BOUND = 10 ** 4

def generate_random_primes(l, h):
    return random_prime(h, lbound=l)

def generate_random_coprime(m):
    while True:
        e = randint(0, m)
        if gcd(m, e) == 1:
            return e

def rsa_encrypt(x, e, n):
    return power_mod(x, e, n)

def rsa_decrypt(y, d, n):
    return power_mod(y, d, n)

x = 483
p = generate_random_primes(LOWER_PRIME_BOUND, UPPER_PRIME_BOUND)
q = generate_random_primes(LOWER_PRIME_BOUND, UPPER_PRIME_BOUND)
n = p * q
f = (p - 1) * (q - 1)
e = generate_random_coprime(f)
d = inverse_mod(e, f)
if rsa_decrypt(rsa_encrypt(x, e, n), d, n) == x:
    print('Program uspešno izvršen.')
