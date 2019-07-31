//=============================================================================
// RandomPicture.js
//=============================================================================

/*:
 * @plugindesc Allows displaying random pictures
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This small plugin allows you to display random pictures.
 * First call a specific plugin command, and then use a Show Picture command,
 * with any image specified, and image for random source (it chooses picture
 * sources from a list you specified in a plugin command) will be displayed.
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                              PLUGIN COMMANDS
 * ============================================================================
 *  - RandomPicture <picture1> <picture2> <etc.>
 *      Selects random picture from your list.
 *      Example :
 *        Event :
 *          Plugin Command : RandomPicture 1 2 3 4
 *          Show Picture
 *        Result :
 *          Picture from either img/pictures/1.png, img/pictures/2.png,
 *          img/pictures/3.png or img/pictures/4.png will be displayed
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - <None>
 *
 * ALIASED :
 *  - Game_Interpreter :
 *    - pluginCommand
 *    - command231
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 */

var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.RandomPicture = {
		version: [1, 0, 0],
	 	aliases: {
        Game_Interpreter: {
            pluginCommand: Game_Interpreter.prototype.pluginCommand,
            command231: Game_Interpreter.prototype.command231
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
    Imported.Kocka.RandomPicture.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
    if(command === "RandomPicture") this._randomPictures = args;
}

Game_Interpreter.prototype.command231 = function()
{
    if(this._randomPictures)this._params[1] = this._randomPictures[Math.randomInt(this._randomPictures.length)];
    this._randomPictures = null;
    return Imported.Kocka.RandomPicture.aliases.Game_Interpreter.command231.apply(this);
}



})();
