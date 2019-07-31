//=============================================================================
// CustomBattleMusic.js
//=============================================================================

/*:
 * @plugindesc Allows you to override default battle BGM and ME
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin allows you to override default battle BGM through troop pages.
 * So, on the first page in the troop you must put comments as described below.
 * If you put more than one BGM, random BGM from that list will be played.
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial release
 * 1.1.0   | Added support for files with space       [Requester : Fisherolol]
 * ============================================================================
 *                                 COMMENTS
 * ============================================================================
 * Put these comments on first event page of troop whose BGM, or ME you want to
 * override.
 *
 *  For BGM
 * <battle-bgm>
 * "YourBGM1" Pan1 Pitch1 Volume1
 * "YourBGM2" Pan2 Pitch2 Volume2
 * etc.
 * </battle-bgm>
 *
 *  For victory ME
 * <battle-victory-me>
 * "YourME1" Pan1 Pitch1 Volume1
 * "YourME2" Pan2 Pitch2 Volume2
 * etc.
 * </battle-victory-me>
 *
 *  For defeat ME
 * <battle-defeat-me>
 * "YourME1" Pan1 Pitch1 Volume1
 * "YourME2" Pan2 Pitch2 Volume2
 * etc.
 * </battle-defeat-me>
 *
 * Example :
 * <battle-bgm>
 * "Battle1" 0 50 100
 * "Battle2" 50 100 50
 * </battle-bgm>
 *
 * If you run out of comment space, add a comment with similar
 * content below. Example :
 *
 * (First comment)
 * <battle-bgm>
 * "Battle1" 0 50 100
 * <==== you ran out of space here...
 *
 * (Second comment)
 * "Battle2" 0 100 100
 * </battle-bgm>
 *
 * If comments are in incorrect form, you'll be notified through console.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - BattleManager :
 *    - makeBattleMusic
 *
 * ALIASED :
 *  - BattleManager :
 *    - setup
 *
 * OVERWRITTEN :
 *  - BattleManager :
 *    - playBattleBgm
 *    - playVictoryMe
 *    - playDefeatMe
 * ============================================================================
 * NOTE : It's not the same thing as : http://goo.gl/VPtWmx
 * ============================================================================
 */

(function(){



// Aliases
var _kocka_random_alias_setup_g5d8NfpW = BattleManager.setup;



//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

BattleManager.setup = function(troopId, canEscape, canLose)
{
    _kocka_random_alias_setup_g5d8NfpW.apply(this, arguments);
    this.makeBattleMusic();
}

BattleManager.makeBattleMusic = function()
{
    var currentBGM = false;
    var currentVictoryME = false;
    var currentDefeatME = false;
    this._possibleBGM = [];
    this._possibleVictoryME = [];
    this._possibleDefeatME = [];
    for(var i = 0; i < $gameTroop.troop().pages[0].list.length; ++i)
    {
        var command = $gameTroop.troop().pages[0].list[i];
        if(command.code == 108 || command.code == 408)
        {
            // Checking BGM
            if(currentBGM)
            {
                if(/<\s*\/\s*battle\s*-\s*bgm\s*>/ig.exec(command.parameters[0])) currentBGM = false;
                else
                {
                    var array = /\"(.+)\"\s*(\d+)\s+(\d+)\s+(\d+)/ig.exec(command.parameters[0]);
                    if(array)this._possibleBGM.push({name: array[1], pan: array[2], pitch: array[3], volume: array[4]});
                }
            }
            else { if(/<\s*battle\s*-\s*bgm\s*>/ig.exec(command.parameters[0]))currentBGM = true; }

            // Checking Victory ME
            if(currentVictoryME)
            {
                if(/<\s*\/\s*battle\s*-\s*victory\s*-\s*me\s*>/ig.exec(command.parameters[0])) currentVictoryME = false;
                else
                {
                    var array = /\"(.+)\"\s*(\d+)\s+(\d+)\s+(\d+)/ig.exec(command.parameters[0]);
                    if(array)this._possibleVictoryME.push({name: array[1], pan: array[2], pitch: array[3], volume: array[4]});
                }
            }
            else { if(/<\s*battle\s*-\s*victory\s*-\s*me\s*>/ig.exec(command.parameters[0]))currentVictoryME = true; }

            // Checking Defeat ME
            if(currentDefeatME)
            {
                if(/<\s*\/\s*battle\s*-\s*defeat\s*-\s*me\s*>/ig.exec(command.parameters[0])) currentDefeatME = false;
                else
                {
                    var array = /\"(.+)\"\s*(\d+)\s+(\d+)\s+(\d+)/ig.exec(command.parameters[0]);
                    if(array)this._possibleDefeatME.push({name: array[1], pan: array[2], pitch: array[3], volume: array[4]});
                }
            }
            else { if(/<\s*battle\s*-\s*defeat\s*-\s*me\s*>/ig.exec(command.parameters[0]))currentDefeatME = true; }
        }
    }
}

BattleManager.playBattleBgm = function()
{
    AudioManager.playBgm(this._possibleBGM.length === 0 ? $gameSystem.battleBgm() : this._possibleBGM[Math.randomInt(this._possibleBGM.length)]);
    AudioManager.stopBgs();
};

BattleManager.playVictoryMe = function() { AudioManager.playMe(this._possibleVictoryME.length === 0 ? $gameSystem.victoryMe() : this._possibleVictoryME[Math.randomInt(this._possibleVictoryME.length)]); };

BattleManager.playDefeatMe = function() { AudioManager.playMe(this._possibleDefeatME.length === 0 ? $gameSystem.defeatMe() : this._possibleDefeatME[Math.randomInt(this._possibleDefeatME.length)]); };


})();
