# Kocka Systems standard library
# (reduced code because of server)
#===============================

# Global variables

__author__    = "KockaAdmiralac <1405223@gmail.com>"
__name__      = "Kocka Systems Standard Library"
CHARSET       = ['a','b','v','g','d','e','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','c','q','w','y','x','1','2','3','4','5','6','7','8','9','0']
DEFAULT_KEY   = "Asdf! Djunfek!"
ERROR_MESSAGE = "[KockaError] %s"
ERRORS        = {
	"err"       : "Unknown Error",
	"login"     : "Wrong username or password!",
	"nameTaken" : "Username already taken!",
	"notEmpty"  : "You can't leave the field empty!"
}
ON_IMPORT     = None
XOR_EXTENSION = ".banana"

# Prerequisites

import os
import hashlib
from xml.etree import ElementTree as xmlTree
os.chdir(os.getcwd())

#----------------------------#
# Functions                  #
#----------------------------#

def xor(string, key = DEFAULT_KEY):
    """ (string, string) -> encrypted string
        Function for low-level encryption
    
        Parameters :
        string : A string to encrypt
        key : A secret key to encrypt string with
        
        Returns :
        The function returns one encrypted (or decrypted) string
        
        Notes :
        The default key is in variable DEFAULT_KEY
    """
    new = ""
    i = 1
    for char in string:
        new += chr(ord(char) ^ ord(key[i % len(key)]))
        i += 1
    return new



def xorfile(filename, key = DEFAULT_KEY):
    """ (string, string) -> None
        Function for low-level file encryption.
        
        Parameters :
        filename : The name of file to encrypt
        key : A secret key to encrypt string with
        
        Notes :
        The default key is in the variable DEFAULT_KEY
        You can change the extension of the temporary 
        encrypted file with variable XOR_EXTENSION
    """
    rFile = open(filename, "r")
    wFile = open(filename + XOR_EXTENSION, "w")
    string = rFile.readline()
    while(string != ""): 
        wFile.write(xor(string[0:-1])+"\n")
        string = rFile.readline()
    rFile.close()
    wFile.close()
    os.system("rm " + filename)
    os.rename(filename + XOR_EXTENSION, filename)
    


def getIdByChar(char):
    i = 1
    for ch in CHARSET:
        if(char.lower() == ch.lower()): return i
        i += 1
    else: print("Char ", char, " is not in CHARSET")

def ks(string , key, operation):
    new = ""
    i = 1
    for char in string:
        exec("new += CHARSET[(getIdByChar(char)" + operation + "getIdByChar(key[i % len(key)]) - 1) % len(CHARSET)]")
        i += 1
    return new

#----------------------------#
# Classes                    #
#----------------------------#

class KockaError( BaseException ):
    def __init__(self, name = "err"):
        message(ERROR_MESSAGE % ERRORS[name])
        exit()

#----------------------------#
# After proccessing          #
#----------------------------#

if(ON_IMPORT is not None): exec(ON_IMPORT)
