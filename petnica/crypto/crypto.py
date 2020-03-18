import math

def gcd(a, b):
    if b == 0:
        return a
    if a == 0:
        return b
    if a > b:
        return gcd(b, a % b)
    if a < b:
        return gcd(b, a % b)

def coprime(n):
    ret = []
    for i in range(n):
        if gcd(n, i) == 1:
            ret.append(i)
    return ret

def primes(n):
    ret = []
    for i in range(2, n + 1):
        is_prime = True
        for j in range(2, math.floor(math.sqrt(i)) + 1):
            if i % j == 0:
                is_prime = False
                break
        if is_prime:
            ret.append(i)
    return ret

def g_func(n):
    p = primes(n)
    ret = []
    for i in p:
        for j in p:
            if i + j == n:
                ret.append((i, j))
    return ret

def goldbach(n):
    for i in range(2, n // 2):
        if len(g_func(i * 2)) == 0:
            print(i * 2, g_func(i * 2))
            return False
    return True

def task_3(n):
    for i in range(1, n):
        for j in range(1, n):
            p = math.pow(i, j)
            if p == n:
                return (i, j)
            elif p > n:
                break
    return False

print(task_3(int(input())))
