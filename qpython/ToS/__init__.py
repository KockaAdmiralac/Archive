# Python Alternative
# Prerequisites
from androidhelper import Android
from random import Random
import time
import tos_origin
import std
import sys
import os

ROLES        = tos_origin.ROLES
TOWN         = tos_origin.TOWN
MAFIA        = tos_origin.MAFIA
NEUTRAL      = tos_origin.NEUTRAL
UNIQUE       = tos_origin.UNIQUE
RANDOMS      = tos_origin.RANDOMS
CLASSIC      = tos_origin.CLASSIC
ALL_ANY      = tos_origin.ALL_ANY
VIGILLANTICS = tos_origin.VIGILLANTICS

andro      = Android()
rnd        = Random()


__author__ = "KockaAdmiralac <1405223@gmail.com>"
__name__   = "ToS alternative for Python"
__file__   = "/mnt/com.hipipal.qpyplus/scripts/ToS/__init__.py"

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.abspath(__file__))+"/Roles")

class Party():
    def __init__(self):
        """
        (None) -> None
        
        Standard class initialization.
        """
        self.roles = []
        self.players = []
        self.nameInput()
        self.modsInput()
        self.roleListAnnouncement()
        std.party = self
        import main
        go = main.Stream()
        

    def nameInput(self):
        """
        (None) -> None
        
        Name input processing.
        """
        self.numPlayers = std.numInput("Players", "Enter the number of players","self.roleListInput()")
        i = 0
        while(i < self.numPlayers):
            name = andro.dialogGetInput("Player name","Enter player "+str(i+1)+"'s name").result
            password = andro.dialogGetPassword("Player password","Enter player "+str(i+1)+"'s password").result
            self.players.append({
            	"name":name,
            	"password":password,
            	"role":None,
            	"state":"alive",
            	"last_will":[],
            	"death_note":[]
            	})
            i += 1
    
    
    
    def roleListInput(self):
        """
        (None) -> None
        
        Standard role list creation.
        """
        i = 0
        while(i < len(self.players)):
            role = std.roleInput("Role input","Input role No."+str(i+1))
            while(role in UNIQUE and role in self.roles): role = std.roleInput("Role input","Input role No."+str(i+1))
            self.roles.append(role)
            i += 1
            
    def modsInput(self):
        andro.dialogCreateAlert("Which mod?")
        andro.dialogSetItems(["Classic","All Any","Vigillantics","Custom"])
        andro.dialogShow()
        response = andro.dialogGetResponse().result
        if(response.has_key('item')):
            if(response["item"]==3): self.roleListInput()
            else: self.roles = {
            	0:CLASSIC,
            	1:ALL_ANY,
            	2:VIGILLANTICS
            }[response["item"]]
        else: self.modsInput()
        
            
    def roleListAnnouncement(self):
        """
        (None) -> None
        
        Announces the role list to players.
        """
        i = 0
        while(i < len(self.players)):
            std.auth(i, self.players[i]["name"], self.players[i]["password"] )
            role = rnd.choice(self.roles)
            self.players[i]["role"] = role
            self.roles.remove(role)
            andro.dialogCreateAlert(self.players[i]["name"]+", your role is "+self.players[i]["role"])
            andro.dialogShow()
            time.sleep(3)
            andro.dialogDismiss()
            i += 1
        

party = Party()