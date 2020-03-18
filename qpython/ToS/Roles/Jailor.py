import _base

class Jailor( _base.Role ):
    def dayAbility(self):
        std.showAlivePlayers(self.players)