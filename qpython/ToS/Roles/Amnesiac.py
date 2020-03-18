import _base
import std

class Amnesiac( _base.Role ):
    def nightAbility(self):
        std.showAlivePlayers(self.players)