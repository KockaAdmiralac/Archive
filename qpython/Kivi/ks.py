# Kocka Systems standard library
#===============================

# Global variables

__author__    = "KockaAdmiralac <1405223@gmail.com>"
__name__      = "Kocka Systems Standard Library"
__file__      = "/storage/sdcard0/com.hipipal.qpyplus/scripts"
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
from androidhelper import Android
from xml.etree import ElementTree as xmlTree
andro = Android()

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

def message(message, dismiss = "Dismiss"):
    andro.dialogCreateAlert(message)
    andro.dialogSetNeutralButtonText(dismiss)
    andro.dialogShow()
    try: 
        if(andro.dialogGetResponse().result["which"] == "neutral"): andro.dialogDismiss()
    except KeyError: andro.dialogDismiss()

def yesNo(message, yes="Yes", no="No"):
    andro.dialogCreateAlert(message)
    andro.dialogSetPositiveButtonText(yes)
    andro.dialogSetNegativeButtonText(no)
    andro.dialogShow()
    if(not "which" in andro.dialogGetResponse().result): return False
    response = andro.dialogGetResponse().result["which"]
    if(response == "negative"): return False
    return True

def listItems(items=[], title="Item list"):
    andro.dialogCreateAlert(title)
    andro.dialogSetItems(items)
    andro.dialogShow()
    response = andro.dialogGetResponse().result
    if('item' in response): return response['item']
    else: listItems(items, title)

def slideValue(title = "Slider", message = "Slide a value", max_value = 100, starting_value = 0):
    andro.dialogCreateSeekBar(starting_value, max_value, title, message)
    andro.dialogShow()
    try: return andro.dialogGetResponse().result['progress']
    except KeyError: slideValue(title, message, max_value, starting_value)

#----------------------------#
# Classes                    #
#----------------------------#

class User():
    def __init__(self, username, password):
        self.name = username
        self.password = password

class UserSystem():
    def __init__(self, filename="users.xml"):
        xorfile("users.xml")
        self.usersFile = xmlTree.parse(filename)
        xorfile("users.xml")
        self.root      = self.usersFile.getroot()
        self.USERS     = []
        self.USERNAMES = []
        self.loggedIn  = []
        for user in self.root: 
            self.USERS.append(User(user.attrib['name'], user.attrib['password']))
            self.USERNAMES.append(user.attrib['name'])
        try:
            if(yesNo("Log in or register?","Log in","Register")): self.loggedIn.append(self.login( andro.dialogGetInput("Username","Enter your username : ").result, hashlib.sha1(andro.dialogGetPassword("Password","Enter your password : ").result).hexdigest()))
            else: self.loggedIn.append(self.register(andro.dialogGetInput("Username","Enter new username : ").result, hashlib.sha1(andro.dialogGetPassword("Password","Enter new password : ").result).hexdigest()))
        except TypeError: raise KockaError("notEmpty")
        
    
    def register(self, username, password, params=[]):
        if(username in self.USERNAMES): raise KockaError("nameTaken")
        writeFile = open("users.xml", "w")
        self.root.insert(0, self.root.makeelement(
        	"user", 
        	{
        		'name'     : username,
        		'password' : password,
        		'param1'   : params[0]
        	}
        ))
        self.USERS.append(User(username, password))
        self.USERNAMES.append(username)
        for line in xmlTree.tostring(self.root) : writeFile.write(line)
        writeFile.close()
        message("Successfully registered!")
        return self.login(username, password, params)
    
    def login(self, username=None, password=None, params = []):
        if(username is not None and password is not None): return User(username, password)
        user = User(andro.dialogGetInput("Username","Enter your username : ").result, hashlib.sha1(andro.dialogGetPassword("Password","Enter your password : ").result).hexdigest())
        if(user in self.USERS): return user
        raise KockaError("login")
        self.login(username, password, params)

class KockaError( BaseException ):
    def __init__(self, name = "err"):
        message(ERROR_MESSAGE % ERRORS[name])
        exit()

#----------------------------#
# After proccessing          #
#----------------------------#

if(ON_IMPORT is not None): exec(ON_IMPORT)
