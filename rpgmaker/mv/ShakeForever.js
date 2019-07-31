//=============================================================================
// Something.js
//=============================================================================

/*:
 * @plugindesc Allows starting shake that shakes the screen forever.
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * Do you sometimes make parallel process events that shake your screen, and
 * then control them with switches and whatnots?
 * This plugin allows much easier shake management, just call one plugin
 * command and Shake Screen afterwards and your shake will start until you say
 * it to stop!
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                              PLUGIN COMMANDS
 * ============================================================================
 *  - Shake start
 *    Starts shaking.
 *  - Shake stop
 *    Stops shaking.
 *  - Shake toggle
 *    If it was shaking, stops, otherwise starts shaking.
 *
 * Note : You must call Shake Screen after start or toggle, but just once, and
 *        it's used to determine how powerful and how fast will shaking be.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - <None>
 *
 * ALIASED :
 *  - Game_Screen :
 *    - update
 *  - Game_Interpreter :
 *    - pluginCommand
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 */

var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.ShakeForever = {
		version: [1, 0, 0],
	 	aliases: {
        Game_Screen: {
            update: Game_Screen.prototype.update
        },
        Game_Interpreter: {
            pluginCommand: Game_Interpreter.prototype.pluginCommand
        }
	 	}
};



(function(){



//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    Imported.Kocka.ShakeForever.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
    if(command === "Shake")
    {
        switch(args[0])
        {
            case 'start':
                $gameScreen.shakeForever = true;
                break;
            case 'stop':
                $gameScreen.shakeForever = false;
                break;
            case 'toggle':
                $gameScreen.shakeForever = !$gameScreen.shakeForever;
                break;
        }
    }
}



//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

Game_Screen.prototype.update = function()
{
    if(this.shakeForever) this._shakeDuration = 2;
    Imported.Kocka.ShakeForever.aliases.Game_Screen.update.apply(this, arguments);
}



})();
