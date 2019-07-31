//=============================================================================
// KockaRespawnEvent.js
//=============================================================================

/*:
 * @plugindesc Allows adding timers for events to respawn
 * @author KockaAdmiralac
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin is made for making events respawn on map.
 * What it actaully does is when you start a respawn timer on an event, that
 * event turns some self switch of his ON, and after specifited amount of
 * seconds (that means, when respawn timer ends) his self switch will be
 * turned OFF.
 * So, you can use it like this :
 *
 * Event Page No. 1 :
 *   Condition : <None>
 *   Commands :
 *     Battle Processing : Some Monster
 *     Plugin command : KockaRespawnEvent start_timer 10 A
 * Event Page No. 2 :
 *   Condition : Self Switch A
 *   Commands : <Empty>
 *
 * This will produce a monster that, after his death, respawns after 10
 * seconds. Note that if you go out of that map and return in 5 seconds,
 * you'll still need to wait 5 more seconds for monster to respawn.
 * From v1.1.0 this will also work even if you exit the game (of course, you
 * would need to save before you exit...)
 * Reqested here : http://goo.gl/7e3LEA
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial release
 * 1.1.0   | Monsters don't disappear after closing the game           [Bugfix]
 * ============================================================================
 *                            PLUGIN COMMANDS
 * ============================================================================
 * So, you have one plugin command :
 *   KockaRespawnEvent start_timer <amount_in_seconds> <self_switch>
 *     - amount_in_seconds : The amount of time in seconds when event will be
 *                           respawned.
 *     - self_switch       : Self switch that is set to ON when timer starts
 *                           and set to OFF when timer ends.
 * Example :
 * Command : KockaRespawnEvent start_timer 100 A
 * Result :
 * On event where this is executed will be turned self switch A to ON, and then
 * after 100 seconds it'll be turned back to OFF.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - Game_EventVariable :
 *    - <All>
 *  - Game_Event :
 *    - startTimer
 *
 * ALIASED :
 *  - DataManager :
 *    - createGameObjects
 *  - Game_Interpreter :
 *    - pluginCommand
 *  - Game_Map :
 *    - update
 *    - initialize
 *  - Game_Event :
 *    - update
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 */



(function() {


var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.RespawnEvent = {
		version: [1, 1, 0],
 	 	aliases: {
 		 		Game_Interpreter: {
 			 			pluginCommand: Game_Interpreter.prototype.pluginCommand
 		 		},
 		 		Game_Map: {
 			 			update: Game_Map.prototype.update,
 			 			initialize: Game_Map.prototype.initialize,
 		 		},
 		 		DataManager: {
 			 			createGameObjects: DataManager.createGameObjects
 		 		},
 		 		Game_Event: {
 			 			update: Game_Event.prototype.update
 		 		}
 	 	}
};

var $gameEventVariables = null;



//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

DataManager.createGameObjects = function()
{
		Imported.Kocka.RespawnEvent.aliases.DataManager.createGameObjects.apply(this, arguments);
		$gameEventVariables = new Game_EventVariable();
}

//-----------------------------------------------------------------------------
// Game_EventVariable
//
// The class for managing event variables, such as respawn timer.

function Game_EventVariable(){ };

Game_EventVariable.prototype.clear = function() { $gameMap.gameEventVariables };

Game_EventVariable.prototype.value = function(arg1, arg2) { return $gameMap.gameEventVariables[arg1] ? $gameMap.gameEventVariables[arg1][arg2] ? $gameMap.gameEventVariables[arg1][arg2] : [-1, 'E'] : [-1, 'E']; };

Game_EventVariable.prototype.setValue = function(arg1, arg2, value)
{
		if(!$gameMap.gameEventVariables[arg1])$gameMap.gameEventVariables[arg1] = [];
		$gameMap.gameEventVariables[arg1][arg2] = value;
};

Game_EventVariable.prototype.decreaseAll = function() { $gameMap.gameEventVariables.forEach(function(element, index, array){ if(element)element.forEach(function(subelement, subindex, subarray){ if(subelement && subelement[0] > 0){ array[index][subindex][0]--; }}); }); };



//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.pluginCommand = function(command, args)
{
	Imported.Kocka.RespawnEvent.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
	if(command === "KockaRespawnEvent")switch(args[0])
	{
		case 'start_timer':
			$gameMap.event(this._eventId).startTimer(args[1], args[2]);
			break;
	}
};



//-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

Game_Event.prototype.update = function()
{
	Imported.Kocka.RespawnEvent.aliases.Game_Event.update.apply(this, arguments);
	if($gameEventVariables.value(this._mapId, this._eventId)[0] === 0)$gameSelfSwitches.setValue([this._mapId, this._eventId, $gameEventVariables.value(this._mapId, this._eventId)[1]], false);
};

Game_Event.prototype.startTimer = function(time, selfSwitch)
{
	this._respawnSelfSwitch = selfSwitch;
	$gameSelfSwitches.setValue([this._mapId, this._eventId, selfSwitch], true);
	$gameEventVariables.setValue(this._mapId, this._eventId, [time * 60, selfSwitch]);
};



//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

Game_Map.prototype.initialize = function()
{
		Imported.Kocka.RespawnEvent.aliases.Game_Map.initialize.apply(this, arguments);
		this.gameEventVariables = [];
}

Game_Map.prototype.update = function()
{
		Imported.Kocka.RespawnEvent.aliases.Game_Map.update.apply(this, arguments);
		$gameEventVariables.decreaseAll();
};



})();
