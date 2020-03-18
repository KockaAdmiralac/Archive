import std
import tos_origin

std.addToPath("Roles")
i = 0
while ( i < len(tos_origin.ROLES) ): 
    exec("import " + tos_origin.ROLES[i])
    i += 1
    


class Stream():
    def __init__(self):
        self.time  = "day"
        self.party = std.party
        i = 0
        while(not self.allWon()): 
            while(i < len(self.party.players)): 
                exec( self.party.players[i]["role"] + "." + self.party.players[i]["role"] + "( player, self.party.players, i )."+self.time)
                i += 1
            exec("self."+self.time)
            """
            Game stages :
                pre_day    - Death announcements, first daily message
                day        - Second daily message
                voting     - Voting for lynch
                defence    - Someone's defence
                pre_night  - Night targeting
                night      - Night processing
            Values of std.lynch :
                nolynch    - Not lynching anybody
                lynch      - Lynching
            Values of std.last_words :
                last_words - The lynched says his last words
                innocent   - The public voted innocent
            """
            self.time = {
            	"pre_day":"day",
            	"day":"voting",
            	"voting":std.lynch,
            	"lynch":"defence",
            	"defence":std.last_words,
            	"last_words":"pre_night",
            	"innocent":"voting",
            	"nolynch":"pre_night",
            	"pre_night":"night",
            	"night":"pre_day"
            	}[self.time]
            
    def allWon(self):
        pass
    
    def pre_day(self):
        pass
        
    def day(self):
        pass
        

    def voting(self):
        i = 0
        votes = []
        while(i < len(std.party.players)):
            votes.append(0)
        i = 0
        while(i < len(std.party.players)):
            votes[std.party.players[i]["voteTarget"]] += 1
            
            
    def defence(self):
        pass
        

    def pre_night(self):
        pass
        

    def night(self):
        pass
        

    def nolynch(self):
        pass
        

    def lynch(self):
        pass
        

    def last_words(self):
        pass
        

    def innocent(self):
        pass
        
