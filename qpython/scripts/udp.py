import socket
from androidhelper import Android
andro = Android()
conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

def xor(string, key):
    new = ""
    i = 1
    for char in string:
        new += chr(ord(char) + ord(key[i % len(key)]))
        i += 1
    return new

CHARSET = ['a','b','v','g','d','e','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','c','q','w','y','x','1','2','3','4','5','6','7','8','9','0']

def getCharById(charId): return CHARSET[charId]

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
        exec("new += getCharById((getIdByChar(char)" + operation + "getIdByChar(key[i % len(key)]) - 1) % len(CHARSET))")
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
 
 
IP = '80.232.19.126'
PORT = 53729
SERVER = yesNo("Server or client?","Server","Client")
KEY = "KEFNUJ"
	
if(not SERVER): conn.bind((IP , PORT))

while True:
    if(SERVER):
        try: conn.sendto(ks(andro.dialogGetInput("Message","Enter the message : ").result, KEY, "+"), (IP,PORT))
        except TypeError: 
            conn.sendto("%INTERRUPT%",(IP,PORT))
            exit()
    else:
        (MESSAGE , DATA) = conn.recvfrom(1024)
        if(MESSAGE.decode("utf-8") != "%INTERRUPT%"): message("From : " + DATA[0] + "\nMessage : " + ks(MESSAGE.decode("utf-8"), KEY, "-") + "\n")
        else:
            message("Connection interrupted!")
            exit()

