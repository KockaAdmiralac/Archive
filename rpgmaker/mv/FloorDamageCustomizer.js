//=============================================================================
// FloorDamageCustomizer.js
//=============================================================================

/*:
 * @plugindesc Allows customizing events that happen on floor damage.
 * <KockaFloorDamage>
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin allows customizing how much damage will you take from floor, and
 * it also allows applying certain states while running on damage floor.
 * For example, you can set that whenever you step on damage floor there is
 * 50% chance that you get Poison state.
 * You regulate which states can be inflicted while walking on damage floor by
 * changing state notetags.
 *
 * This plugin is contributed to ReStaff.
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                                NOTETAGS
 * ============================================================================
 * State Notetags :
 * - <floor_state:X>
 *   This notetag marks state as "can be inflicted by floor damage".
 *   X is probability from 0 to 100 whether state will be inflicted.
 *   Examples :
 *   Notetag : <floor_state:50>
 *   Result : There is 50% chance that this state gets inflicted on you.
 *
 *   Notetag : <floor_state:1>
 *   Result : There is 1% chance that this state gets inflicted on you.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - DataManager
 *    - loadFloorStates
 *
 * ALIASED :
 *  - Game_Actor :
 *    - executeFloorDamage
 *    - performMapDamage
 *  - DataManager :
 *    - onLoad
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 * @param Floor Damage
 * @desc Value of damage taken from floor. Can be set to JS expressions.
 * @default 10
 *
 * @param Flash
 * @desc Will flash be displayed on map damage? Can be set to JS expressions.
 * @default true
 */

(function(){



// Loading plugin parameters
var _plugin_params = $plugins.filter(function(p) { return p.description.contains('<KockaFloorDamage>'); })[0].parameters;
var FLOOR_DAMAGE = _plugin_params["Floor Damage"];
var FLASH_CONDITION = _plugin_params["Flash"];



// Setting Imported object and aliasing
var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.FloorDamageCustomizer = {
    version: [1, 0, 0],
    aliases: {
        Game_Actor: {
            executeFloorDamage: Game_Actor.prototype.executeFloorDamage,
            performMapDamage: Game_Actor.prototype.performMapDamage
        },
        DataManager: {
            onLoad: DataManager.onLoad
        }
    }
};



//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

DataManager.onLoad = function(obj)
{
    Imported.Kocka.FloorDamageCustomizer.aliases.DataManager.onLoad.apply(this, arguments);
    if(obj === $dataStates) this.loadFloorStates();
}

DataManager.loadFloorStates = function()
{
    this.floorStates = [];
    for(var i = 1; i < $dataStates.length; ++i)
    {
        var meta = $dataStates[i].meta.floor_state;
        if(meta) this.floorStates.push([i, meta]);
    }
}



//-----------------------------------------------------------------------------876
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype.executeFloorDamage = function()
{
    console.log(this.basicFloorDamage());
    Imported.Kocka.FloorDamageCustomizer.aliases.Game_Actor.executeFloorDamage.apply(this, arguments);
    for(var i = 0; i < DataManager.floorStates.length; ++i)
    {
        var state = DataManager.floorStates[i];
        if(Math.randomInt(100) < eval(state[1]) && !this.isStateAffected(state[0])) this.addState(state[0]);
    }
};

Game_Actor.prototype.basicFloorDamage = function() { return eval(FLOOR_DAMAGE); };

Game_Actor.prototype.performMapDamage = function() { if(eval(FLASH_CONDITION)) Imported.Kocka.FloorDamageCustomizer.aliases.Game_Actor.performMapDamage.apply(this, arguments); };



})();
