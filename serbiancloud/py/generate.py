#-*-coding:utf-8-*-
#
#   generate.py
#
#   Main script for generating images for SerbianCloud

import sys, re
import operator
import stemmer
from collections import defaultdict
from os import path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS

outFile = ""
maskFile = ""
bgColor = ""

if len(sys.argv) < 2:
    print("Invalid argument count")
    sys.exit()
else:
    if len(sys.argv) >= 3:
	    bgColor = sys.argv[2]
    if len(sys.argv) == 4:
	    maskFile = "py/masks/" + sys.argv[3] + ".jpg"
    outFile = sys.argv[1]
inp = open("py/text/" + outFile + ".txt", encoding="utf-8", mode="r")
text = inp.read()
inp.close()
text = re.sub('[\W_]+', ' ', text)
splits = [x for x in text.split(' ') if (not x.isspace() and x)]
stemsplits = stemmer.stem(" ".join(splits)).split(' ')
dicta = {}
dicts = defaultdict(int)
dictst = defaultdict(int)
dictfull = {}
for x in range(0, len(splits)):
    dicta[splits[x]] = stemsplits[x]
for x in range(0, len(splits)):
    dicts[splits[x]] += 1
for x in range(0, len(stemsplits)):
    dictst[stemsplits[x]] += 1
sorted_d = sorted(dicts.items(), key=operator.itemgetter(1))
brr = len(splits)
for w in range(0,len(sorted_d)):
    if dicta[sorted_d[w][0]] not in dictfull:
        dictfull[dicta[sorted_d[w][0]]] = (sorted_d[w][0], dictst[dicta[sorted_d[w][0]]] / brr)
dictidf = {}
idff = open("py/id.f", encoding="utf-8", mode="r")
ufidf = idff.read().splitlines()
idff.close()
for w in range(0, len(ufidf)):
    idfsplits = ufidf[w].split(' ')
    dictidf[idfsplits[0]] = float(idfsplits[1])
dictidftf = {}
for word, tup in dictfull.items():
    if word in dictidf:
	    dictidftf[word] = (dictfull[word][0], dictfull[word][1] / dictidf[word])
    else:
	    dictidftf[word] = (dictfull[word][0], dictfull[word][1] / 0.0001)
if len(sys.argv) == 4:
    wc = WordCloud(width=600, height=400, mask=np.array(Image.open(maskFile)), background_color=bgColor)
elif len(sys.argv) == 3:
    wc = WordCloud(width=600, height=400, background_color=bgColor)	
else:
    wc = WordCloud(width=600, height=400, background_color="white")	
wc.fit_words(dict(list(dictidftf.values())))
wc.to_file("i/" + outFile + ".png")
print("success")
