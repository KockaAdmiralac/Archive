from boba import encode
from parameters import C5

C5 = [19, 7, 5, 0, 0, 19, 11, 4, 4, 26, 7, 9, 12, 26, 19, 14, 26, 13, 0, 18, 17, 25, 0, 8, 4, 17]
dictionary = []
with open('dictionary.txt') as d:
    for line in d.readlines():
        rline = line.strip()
        if rline != '':
            dictionary.append(rline)

def recursion(current, words=[]):
    possible = []
    for word in dictionary:
        if len(word) > len(current):
            continue
        is_possible = True
        for i in range(len(word)):
            ch = word[i]
            ench = encode(ch)
            if not (ench == current[i] or ench == (current[i] - 1) % 27):
                is_possible = False
                break

        if len(word) > len(current) - 1:
            possible_space = 0
        else:
            possible_space = current[len(word)]
        if is_possible and possible_space == 0 or possible_space == 26:
            possible.append(word)

    for word in possible:
        if len(word) > len(current) - 1:
            for possible_word in possible:
                final_word = words.copy()
                final_word.append(possible_word)
                print(' '.join(final_word))
        else:
            next_words = words.copy()
            next_words.append(word)
            recursion(current[len(word) + 1:], next_words)

recursion(C5)
