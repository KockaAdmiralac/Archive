//=============================================================================
// TwoSyncWindows.js
//=============================================================================

/*:
 * @plugindesc Shows two synchronized windows
 * @author It does not matter, but I'm KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This is just a demonstrative plugin that shows how two windows can have
 * synchonized elements.
 * ============================================================================
 *                             PLUGIN COMMANDS
 * ============================================================================
 *  - ShowSynchronizedWindows
 *    Shows scene with synchronized windows.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - <None>
 *
 * ALIASED :
 *  - Game_Interpreter :
 *    - pluginCommand
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 */

var Imported = Imported || {};
Imported.TwoSyncWindows = {
		version: [1, 0, 0],
	 	aliases: {
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
    Imported.TwoSyncWindows.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
    if(command === "ShowSynchronizedWindows") SceneManager.push(Scene_TwoSyncWindows);
}



//-----------------------------------------------------------------------------
// Window_One
//
// First window. Used for selecting some item.

function Window_One() { this.initialize.apply(this, arguments); }

Window_One.prototype = Object.create(Window_Selectable.prototype);
Window_One.prototype.constructor = Window_One;

Window_One.prototype.initialize = function(data)
{
    this.data = data;
    Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.width / 2, Graphics.height);
    this.select(0);
    this.activate();
    this.refresh();
};

Window_One.prototype.drawItem = function(index)
{
    rect = this.itemRect(index);
    this.drawTextEx(this.data[index], rect.x, rect.y);
};

Window_One.prototype.maxItems = function() { return this.data.length; };

Window_One.prototype.cursorUp = function()
{
    Window_Selectable.prototype.cursorUp.apply(this, arguments);
    this.callHandler("up");
};

Window_One.prototype.cursorDown = function()
{
    Window_Selectable.prototype.cursorDown.apply(this, arguments);
    this.callHandler("down");
};



//-----------------------------------------------------------------------------
// Window_Two
//
// Second window. Used for displaying item selected in the first window.

function Window_Two() { this.initialize.apply(this, arguments); }

Window_Two.prototype = Object.create(Window_Base.prototype);
Window_Two.prototype.constructor = Window_Two;

Window_Two.prototype.initialize = function() { Window_Base.prototype.initialize.call(this, Graphics.width / 2, 0, Graphics.width / 2, Graphics.height); };

Window_Two.prototype.setItem = function(item)
{
    this.contents.clear();
    this.drawTextEx(item, 0, 0);
};



//-----------------------------------------------------------------------------
// Scene_TwoSyncWindows
//
// Scene class used for synchronizing two windows. All data is stored here.

function Scene_TwoSyncWindows() { this.initialize.apply(this, arguments); }

Scene_TwoSyncWindows.prototype = Object.create(Scene_MenuBase.prototype);
Scene_TwoSyncWindows.prototype.constructor = Scene_TwoSyncWindows;

Scene_TwoSyncWindows.prototype.create = function()
{
    Scene_MenuBase.prototype.create.apply(this, arguments);
    this.data = ["Item One", "ASDF", "Lol", "Not ended yet", "The End", "Or not?"];
    this.createAllWindows();
};

Scene_TwoSyncWindows.prototype.createAllWindows = function()
{
    this.createWindowOne();
    this.createWindowTwo();
};

Scene_TwoSyncWindows.prototype.createWindowOne = function()
{
    this._windowOne = new Window_One(this.data);
    this._windowOne.setHandler("down",    this.onDown.bind(this));
    this._windowOne.setHandler("up",      this.onUp.bind(this));
    this._windowOne.setHandler("cancel",  this.popScene.bind(this));
    this.addWindow(this._windowOne);
};

Scene_TwoSyncWindows.prototype.createWindowTwo = function()
{
    this._windowTwo = new Window_Two();
    this.addWindow(this._windowTwo);
    this._windowTwo.setItem(this.data[0]);
};

Scene_TwoSyncWindows.prototype.onDown = function() { this._windowTwo.setItem(this.data[this._windowOne.index()]); };
Scene_TwoSyncWindows.prototype.onUp = function() { this._windowTwo.setItem(this.data[this._windowOne.index()]); };



})();
