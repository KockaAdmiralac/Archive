//=============================================================================
// DashStamina.js
//=============================================================================

/*:
 * @plugindesc Adds stamina bar and restricts dashing
 * @author KockaAdmiralac
 *
 * @help
 * Restricts infinite dashing by adding a stamina bar.
 * By dashing you lose stamina, and when you lose all stamina you can't dash.
 * You can configure the position of stamina bar and what image will be shown
 * as stamina bar.
 * Max stamina, stamina regenerating, and losing of stamina are stored in a
 * variable, so you can change maximum stamina and how fast is player
 * losing/regenerating his stamina in-game.
 *
 * @param Max Stamina Variable
 * @desc What variable will be used for max stamina?
 * @default 1
 *
 * @param Regeneration Rate Variable
 * @desc Variable iD that sets how fast will you regenerate stamina
 * @default 2
 *
 * @param Consuming Rate Variable
 * @desc Variable iD that sets how fast will you lose stamina
 * @default 3
 *
 * @param Stamina Bar Image
 * @desc Image that will be displayed as stamina bar.
 * @default DashStamina
 *
 * @param Stamina Bar X
 * @desc X position of stamina bar.
 * @default 20
 *
 * @param Stamina Bar Y
 * @desc Y position of stamina bar.
 * @default 8
 */

(function(){



// Aliases
_kocka_random_alias_onMapLoaded_n7L0b2Nf = Scene_Map.prototype.onMapLoaded;
_kocka_random_alias_update_g6DbeMdf = Scene_Map.prototype.update;
_kocka_random_alias_initialize_4GdM3hDt = Game_Player.prototype.initialize;
_kocka_random_alias_isDashDisabled_6D93Mf2d = Game_Map.prototype.isDashDisabled;



// Plugin parameters
var _pluginParams = PluginManager.parameters("DashStamina");
var maxStamina = _pluginParams['Max Stamina Variable'];
var staminaRegen = _pluginParams['Regeneration Rate Variable'];
var staminaLose = _pluginParams['Consuming Rate Variable'];
var staminaImage = _pluginParams['Stamina Bar Image'];
var staminaX = _pluginParams['Stamina Bar X'];
var staminaY = _pluginParams['Stamina Bar Y'];



//-----------------------------------------------------------------------------
// Game_Player
//
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

Game_Player.prototype.initialize = function()
{
	_kocka_random_alias_initialize_4GdM3hDt.apply(this, arguments);
	this._stamina = $gameVariables.value(maxStamina);
};

Object.defineProperty(Game_Player.prototype, 'stamina',
{
	get: function(){ return this._stamina; },
	set: function(value){ this._stamina = value; },
	configurable: true
});



//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

Game_Map.prototype.isDashDisabled  = function() { return _kocka_random_alias_isDashDisabled_6D93Mf2d.apply(this, arguments) ||  $gamePlayer.stamina <= 0; }



//-----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying the stamina bar.

function Sprite_Stamina() { this.initialize.apply(this, arguments); };

Sprite_Stamina.prototype = Object.create(Sprite.prototype);
Sprite_Stamina.prototype.constructor = Sprite_Stamina;

Sprite_Stamina.prototype.initialize = function()
{
	Sprite.prototype.initialize.call(this);
	this.bitmap = ImageManager.loadPicture(staminaImage);
	this.x = staminaX;
	this.y = staminaY;
	this.update();
}

Sprite_Stamina.prototype.update = function()
{
	Sprite.prototype.update.call(this);
	this.setFrame(0, 0, this.bitmap.width * $gamePlayer.stamina / $gameVariables.value(maxStamina), this.bitmap.height);
};



//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.

Scene_Map.prototype.onMapLoaded = function()
{
	_kocka_random_alias_onMapLoaded_n7L0b2Nf.apply(this, arguments);
	this._staminaSprite = new Sprite_Stamina();
	this.addChild(this._staminaSprite);
}

Scene_Map.prototype.update = function()
{
	_kocka_random_alias_update_g6DbeMdf.apply(this, arguments);
	$gamePlayer.stamina -= $gamePlayer.isDashing() && $gamePlayer.isMoving() ? (($gamePlayer.stamina > 0) ? $gameVariables.value(staminaLose) : 0) : (($gamePlayer.stamina <= $gameVariables.value(maxStamina)) ? -$gameVariables.value(staminaRegen) : 0);
	this._staminaSprite.update();
}



})();
