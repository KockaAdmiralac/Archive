import numpy as np
from PIL import Image
from time import time
from typing import List, Tuple
import os

map = np.array(Image.open(input()))
N = int(input())
w, h = [int(x) for x in input().split(' ')]
map_width = 563
map_height = 345
start_time = time()
image_paths = [input() for i in range(N)]

tmp_ii = np.zeros((map_height, map_width, 3))
map_ii = np.zeros((map_height - h + 1, map_width - w + 1, 3))

for y in range(map_height):
    for x in range(map_width):
        sum_pixel = [0, 0, 0]
        for k in range(3):
            sum = int(map[y, x, k])
            if y > 0:
                sum += int(tmp_ii[y - 1, x, k])
            if x > 0:
                sum += int(tmp_ii[y, x - 1, k])
            if y > 0 and x > 0:
                sum -= int(tmp_ii[y - 1, x - 1, k])
            sum_pixel[k] = sum
        tmp_ii[y, x] = sum_pixel

for y in range(map_height - h + 1):
    for x in range(map_width - w + 1):
        sum_pixel = [0, 0, 0]
        for k in range(3):
            sum = tmp_ii[y + h - 1, x + w - 1, k]
            if y > 0:
                sum -= tmp_ii[y - 1, x + w - 1, k]
            if x > 0:
                sum -= tmp_ii[y + h - 1, x - 1, k]
            if x > 0 and y > 0:
                sum += tmp_ii[y - 1, x - 1, k]
            sum_pixel[k] = sum
        map_ii[y, x] = sum_pixel

def diff_square(x: int, y: int, image: np.ndarray) -> int:
    diff = 0
    for iy in range(h):
        for ix in range(w):
            for k in range(3):
                diff += abs(int(image[iy, ix, k]) - int(map[y + iy, x + ix, k]))
    return diff

for path in image_paths:
    if time() - start_time > (17.5 if N > 100 else 18.5):
        break
    N -= 1
    image = np.array(Image.open(path))
    sum = [0, 0, 0]
    for y in range(h):
        for x in range(w):
            for k in range(3):
                sum[k] += int(image[y, x, k])
    thres = 20
    candidates: List[Tuple[int, int]] = []
    while len(candidates) == 0:
        for y in range(map_ii.shape[0]):
            for x in range(map_ii.shape[1]):
                if map_ii[y, x, 0] - thres < sum[0] < map_ii[y, x, 0] + thres and map_ii[y, x, 1] - thres < sum[1] < map_ii[y, x, 1] + thres and map_ii[y, x, 2] - thres < sum[2] < map_ii[y, x, 2] + thres:
                    candidates.append((x, y))
        thres *= 2
    min_diff = 100 * w * h
    min_candidate = (0, 0)
    for candidate in candidates:
        diff = diff_square(candidate[0], candidate[1], image)
        if diff < min_diff:
            min_diff = diff
            min_candidate = candidate
    print(min_candidate[0], min_candidate[1])

os.write(1, b''.join([b'0 0\n' for x in range(N)]))
