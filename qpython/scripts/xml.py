import os
import ks
import random
import hashlib
from androidhelper import Android
from xml.etree import ElementTree
andro = Android()
os.chdir("/sdcard/com.hipipal.qpyplus/scripts/")

a = open("asdf.txt")
b = a.readlines()
a.close()

a = open("asdf.txt","w")

for line in b: 
    if(line[len(line)-1] == "\n"): a.write(ks.xor(line[0:len(line)-1]+"\n","1405223"))
    else: a.write(ks.xor(line, "1405223"))
