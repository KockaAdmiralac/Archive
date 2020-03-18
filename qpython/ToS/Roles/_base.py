import sys
import os

__file__   = "/mnt/sdcard/com.hipipal.qpyplus/scripts/ToS/__init__.py"

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.abspath(__file__))+"/Roles")


import std
import tos_origin
from androidhelper import Android
import time
import chat


chat  = chat.Chat()
andro = Android()

class Role():
    def __init__(self, stats, players, num):
        
        self.name       = stats["name"]
        self.state      = stats["state"]
        self.password   = stats["password"]
        self.last_will  = stats["last_will"]
        self.death_note = stats["death_note"]
        self.players    = players
        self.killing    = 0
        self.num        = num
        std.auth(self.num, self.name, self.password)

    def pre_day(self):
        """
        Death announcements.
        """
        i = 0
        while(i < len(std.newDeads)):
            std.message(std.newDeads[i]["name"]+" was found dead last night.")
            
            
    def day(self):
        if(self.state == "dead"): self.deadAbility()
        elif(self.state == "bmd"): return 1
        else: self.dayAbility()
    
    def voting(self):
        std.party.players[self.num]["voteTarget"] = andro.dialogGetInput("Voting","Who would you like fo vote for?").result
        
        
    def pre_night(self):
        std.message(std.party.players[std.lynchTarget]["name"]+" : "+ std.party.players[std.lynchTarget]["last_words"], 5)
        i = 0
        while(i < len(std.party.players[std.lynchTarget]["last_will"])):
            std.message(std.party.players[std.lynchTarget]["last_will"][i],3)
            i += 1
    def night(self):
        std.auth(self.num, self.name, self.password)
        if(self.state == "dead"): return 1
        else: self.nightAbility()
        self.editLastWill()
        if( self.killing ): self.editDeathNote
        
    def lynch(self):
        if(std.lynchTarget == self.num):
            std.message("You are being lynched!")
            self.lynchMessage = andro.dialogGetInput("Defence","Do you have something in defence?").result
        else: std.message("The Town has decided to put "+std.lynchTarget+" on trial")
            
    def defence(self):
        if(not std.lynchTarget == self.num): std.message(std.party.players[std.lynchTarget]["name"]+  " : "+ std.party.players[std.lynchTarget]["message"] ,5)
    
    def nolynch(self):
        pass
        
    def last_words(self):
        if(std.lynchTarget == self.num):
            std.message("The Town has decided to lynch you!")
            std.party.players[self.num]["last_words"] = andro.dialogGetInput("Last words","Do you have any last words?")
        else: std.message("The Town has decided to lynch "+std.party.players[std.lynchTarget]["name"])
        
    def innocent(self):
        if(std.lynchTarget == self.num): std.message("The Town has decided to lynch you!")
        else: std.message("The Town has decided to pardon "+std.party.players[std.lynchTarget]["name"])
        
    def dayAbility(self):
        pass
        
    def nightAbility(self):
        pass
        
    def deadAbility(self):
        pass

    def chat(self, night):
        if(self.state == "jailed"):
            std.message("You were hauled off to jail!", 2)
            self.jailMessage = andro.dialogGetInput("Defence", "Do you have something to say to Jailor?")
        
        if(self.state == "bmd"): 
            std.message("You are blackmailed!", 2)
            andro.dialogDismiss()

        if(not self.state == "bmd" and not night):
            chat.say(andro.dialogGetInput("Chat","Would you wish to say something?").result, self.name)
            
    def editLastWill(self):
        if(std.yesNo("Would you like to edit last will?")): self.last_will.append(andro.dialogGetInput("Last Will","What would you like to add?").result)
        if(std.yesNo("Anything else?")): self.editLastWill()
        
    def attacked(who):
        if(not self.healed and not self.immune): andro.dialogCreateAlert(who)
        if(self.healed): andro.dialogCreateAlert("You were healed!")
        time.sleep(3)
        andro.dialogDismiss()