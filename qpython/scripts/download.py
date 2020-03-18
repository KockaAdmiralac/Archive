import urllib
import random
import ks
import os
from androidhelper import Android

andro = Android()
open(os.getcwd() + "/tmp", "w")
urllib.urlretrieve("http://127.0.0.1:8080/brz.php?text=gfhxfg", os.getcwd() + "/tmp")