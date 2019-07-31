//=============================================================================
// YEP_WeakResist.js
//=============================================================================

/*:
 * @plugindesc Add-on to YEP Battle Engine that shows Weak/Resist popups.
 * @author KockaAdmiralac
 *
 * @help
 * This is not really finished yet...
 *
 * @param Weak
 * @desc If element rate is bigger than this parameter, "Weak" will be displayed
 * @default 1.2
 *
 * @param Resist
 * @desc If element rate is smaller than this parameter, "Resist" will be
 * displayed
 * @default 0.8
 *
 * @param Weak Jump
 * @desc Because this is just a temporary version, I had to make
 * Weakpoint text to jump. This is where you configure how high.
 * @default 30
 *
 * @param Resist Jump
 * @desc Because this is just a temporary version, I had to make
 * Resist text to jump. This is where you configure how high.
 * @default 30
 */

(function(){



// Aliases
var _kocka_random_alias_clear_4b8L2M99 = Game_ActionResult.prototype.clear;
var _kocka_random_alias_apply_h7G3Bp1m = Game_Action.prototype.apply;
var _kocka_random_alias_setup_3BfM6fH4 = Sprite_Damage.prototype.setup;
var _kocka_random_alias_initialize_3Bjd9R7x = Sprite_Damage.prototype.initialize;



// Parameters
var _pluginParams = PluginManager.parameters("YEP_WeakResist");
var weakResult = _pluginParams["Weak"];
var resistResult = _pluginParams["Resist"];
var weakJump = Number(_pluginParams["Weak Jump"]);
var resistJump = Number(_pluginParams["Resist Jump"]);



//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

Game_ActionResult.prototype.clear = function()
{
    _kocka_random_alias_clear_4b8L2M99.apply(this, arguments);
    this.elementId = -1;
}



//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Game_Action.prototype.apply = function(target)
{
    _kocka_random_alias_apply_h7G3Bp1m.apply(this, arguments);
    var result = target.result();
    if(result.isHit()) result.elementId = this.item().damage.elementId;
}



//-----------------------------------------------------------------------------542
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Game_Battler.prototype.resultWeak = function()
{
    if(this._result.elementId < 0)return false;
    if(this.elementRate(this._result.elementId) > weakResult)return true;
    return false;
}

Game_Battler.prototype.resultResist = function()
{
    if(this._result.elementId < 0)return false;
    if(this.elementRate(this._result.elementId) < resistResult)return true;
    return false;
}



//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

Sprite_Battler.prototype.setupDamagePopup = function()
{
    if (this._battler.isDamagePopupRequested())
    {
        if (this._battler.isSpriteVisible())
        {
            var sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            if(this._battler.resultWeak())sprite.setWeak();
            else if(this._battler.resultResist())sprite.setResist();
            sprite.setup(this._battler);
            this.pushDamageSprite(sprite);
						BattleManager._spriteset.addChild(sprite)
        }
    }
    else
    {
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
};



//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

Sprite_Damage.prototype.intialize = function()
{
    _kocka_random_alias_initialize_3Bjd9R7x.apply(this, arguments);
    this._weak = false;
    this._resist = false;
}
Sprite_Damage.prototype.setWeak = function() { this._weak = true; };
Sprite_Damage.prototype.setResist = function() { this._resist = true; };
Sprite_Damage.prototype.digitHeight = function() { return this._damageBitmap ? this._damageBitmap.height / 7 : 0; };
Sprite_Damage.prototype.setup = function(target)
{
    _kocka_random_alias_setup_3BfM6fH4.apply(this, arguments);
    if(this._weak)this.createWeak();
    if(this._resist)this.createResist();
}

Sprite_Damage.prototype.createWeak = function()
{
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 5 * h, 8 * w, h);
    sprite.dy = weakJump;
}

Sprite_Damage.prototype.createResist = function()
{
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 6 * h, 6 * w, h);
    sprite.dy = resistJump;
}

})();
