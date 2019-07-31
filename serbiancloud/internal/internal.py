import sys,re
import operator
import stemmer
from collections import defaultdict

inFile=""

if len(sys.argv)<2:
    print("Nesto nije ok")
    sys.exit()
else:
    inFile=sys.argv[1]
inp = open(inFile,encoding="utf-8",mode="r")
text = inp.read()
inp.close()
text = re.sub('[\W_]+',' ',text)
splits = text.split(' ')
splits = [x for x in splits if (not x.isspace() and x)]
stemsplits = stemmer.stem(" ".join(splits)).split(' ')
dict = defaultdict(int)
for x in range(0, len(stemsplits)):
    dict[stemsplits[x]]+=1
brr=len(splits)
for word, freq in dict.items():
    dict[word]=dict[word]/brr
fo = open("id.f",encoding="utf-8",mode = "w")
for word, freq in dict.items():
	fo.write(word+" "+str(freq)+"\n")
fo.close()