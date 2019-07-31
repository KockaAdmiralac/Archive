//=============================================================================
// ShazDiagonalMovement.js
//=============================================================================

/*:
 * @plugindesc For staircases, slopes etc.
 * @author Shaz
 *
 * @help
 * Translation to JS made by KockaAdmiralac, for this : http://goo.gl/WSLeRj
 * For more help look at http://goo.gl/nonyvq
 *
 * @param Terrain Lookup
 * @desc If you'll use region iDs set to 0, and if you'll be using terrain tags 
 * set to 1.
 * @default 1
 * 
 * @param Up When Right
 * @desc Terrain or region iD to go up when moving right 
 * set to 1.
 * @default 1
 * 
 * @param Down When Right
 * @desc Terrain or region iD to go down when moving right  
 * set to 1.
 * @default 1
 */

(function() {

var _shaz_random_alias_move_straight_3BfhD0cj = Game_CharacterBase.prototype.moveStraight;

var pluginParams = PluginManager.parameters("ShazDiagonalMovement");
var terrainLookup = (pluginParams["Terrain Lookup"] === "1");
var UPLR = Number(pluginParams["Up When Right"]);
var DOWNLR = Number(pluginParams["Down When Right"]);


Game_CharacterBase.prototype.diagonalOverride = function(d)
{
	var this_override = terrainLookup ? $gameMap.terrainTag(this._x, this._y) : $gameMap.regionId(this._x, this._y)
	var new_x = $gameMap.roundXWithDirection(this._x, d);
	var new_y = $gameMap.roundYWithDirection(this._y, d);
	var new_override = terrainLookup ? $gameMap.terrainTag(new_x, new_y) : $gameMap.regionId(new_x, new_y);
	console.log(terrainLookup);
	return (new_override == UPLR && d == 6) ? [6, 8] : (new_override == DOWNLR && d == 4) ? [4, 8] : (this_override == UPLR && d == 4) ? [4, 2] : (this_override == DOWNLR && d == 6) ? [6, 2] : (new_override == DOWNLR && d == 8) ? [6, 8] : (new_override == UPLR && d == 2) ? [4, 2] : [0, 0];
};

Game_CharacterBase.prototype.moveStraight = function(d)
{
	var arr = this.diagonalOverride(d);
	console.log(arr);
	(arr[0] != 0 && arr[1] != 0) ? this.moveDiagonally(arr[0], arr[1]) : _shaz_random_alias_move_straight_3BfhD0cj.apply(this, arguments);
}


})();