from androidhelper import Android
from random import Random
import tos_origin
import os, sys, inspect
import time

ROLES     = tos_origin.ROLES
TOWN      = tos_origin.TOWN
MAFIA     = tos_origin.MAFIA
NEUTRAL   = tos_origin.NEUTRAL
UNIQUE    = tos_origin.UNIQUE
RANDOMS   = tos_origin.RANDOMS

rnd = Random()
andro = Android()
players = []


def auth(num, name, password):
    """
    (int) -> None
        
    Authorize the current user.
    """
    if(andro.dialogGetInput("Authorization","Enter password for " + name).result == password): pass
    else: auth(num, name, password)
    


def numInput(title=" ",message=" ",func = None):
    """
    (string, string, string) -> int

    First parameter is the title of dialog. (default "")
    Second parameter is the message of the dialog. (default "")
    Third parameter is a function to call if input is invalid. (default None)
        
    The function displays a number input dialog, and returns a value entered.
    If input is invalid, it calls the supplied function.
    """
    try:
        return int(andro.dialogGetInput(title, message).result)
    except ValueError: 
        if(func != None): exec(func)
    except TypeError: 
        if(func != None): exec(func)
    
    
    
def roleInput (title=" ",message=" ",func = None):
    role = andro.dialogGetInput(title,message).result
    if(role in ROLES): return role
    elif(role in RANDOMS):
        return rnd.choice({
                "Town (Support)":["Mayor","Transporter","Escort","Medium"],
                "Town (Killing)":["Jailor","Veteran","Vigillante"],
                "Town (Protective)":["Retributionist","BodyGuard","Doctor"],
                "Town (Investigative)":["Spy","Investigator","Lookout","Sheriff"],
                "Mafia (Killing)":["Godfather","Mafioso"],
                "Mafia (Support)":["Consigliere","Consort"],
                "Mafia (Deception)":["Blackmailer","Janitor","Framer","Disguiser"],
                "Neutral (Evil)":["Executioner","Jester","Witch"],
                "Neutral (Benign)":["Amnesiac","Survivor"],
                "Neutral (Killing)":["SerialKiller","Werewolf","Arsonist"],
                "Random Town":TOWN,
                "Random Mafia":MAFIA,
                "Random Neutral":NEUTRAL,
                "Any":ROLES
            }[role])
    else:
        std.message("You must choose a role!")
        roleInput(title,message,func)




def addToPath(subfolder):
    cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],subfolder)))
    if cmd_subfolder not in sys.path: sys.path.insert(0, cmd_subfolder)


def showAlivePlayers(players):
    i = 0
    ALIVE = []
    while(i < len(players)):
        if(players[i]["state"] == "alive"): ALIVE.append(players[i]["name"])
        i += 1
    andro.dialogCreateAlert("Target")
    andro.dialogSetItems(ALIVE)
    andro.dialogShow()
    return int(andro.dialogGetResponse().result["item"])

def message(message, timeout=2):
    andro.dialogCreateAlert(message)
    andro.dialogShow()
    time.sleep(timeout)
    andro.dialogDismiss()

def yesNo(message, yes="Yes", no="No"):
    andro.dialogCreateAlert(message)
    andro.dialogSetPositiveButtonText(yes)
    andro.dialogSetNegativeButtonText(no)
    if(not andro.dialogGetResponse().result.has_key("which")): return False
    response = andro.dialogGetResponse().result["which"]
    if(response == "negative"): return False
    return True
    
def exceptPlayers(option):
    i = 0
    players = self.players
    while(i < len(self.players)): 
        if(option == self.players["state"]): players.pop(i)
    return players
    
