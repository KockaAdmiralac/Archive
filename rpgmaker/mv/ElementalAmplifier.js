//=============================================================================
// ElementalAmplifier.js
//=============================================================================

/*:
 * @plugindesc Allows boost of attack to actors on skills with certain element
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin allows boosting skills with specified elements.
 * You can boost them based on Actor/Enemy that is using it, Actor's class,
 * Weapon/Armor that Actor is using or state that is currently applied to
 * Actor/Enemy.
 * Made as a request for this : http://goo.gl/k2ssyB
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial release
 * 1.1.0   | Added possibility for multiple element boosts.
 * 1.1.5   | Added possibility of writing JS expressions instead of numbers
 * ============================================================================
 *                                NOTETAGS
 * ============================================================================
 * Actor, Enemy, Class, Weapon, Armor and State Notetag :
 * - <element_boost:elementId boost>
 *   - When actor uses a skill with iD equal to elementId (you can find
 *     element iDs in Types section in Database) the value of the attack will
 *     be multiplied by boost.
 *     If you put it in Actor notetag, that actor will have the boost.
 *     If you put it in Class notetag, actors with that class will boost.
 *     If you put it in Enemy notetag, that enemy will have the boost.
 *     If you put it in Weapon/Armor notetag, actors that equipped that
 *     Weapon/Armor will have the boost.
 *     If you put it in State notetag, actors with that state
 *     Example :
 *     Notetag : <element_boost:1 100000>
 *     Result : All attacks with element Physical will have damage value
 *              multiplied by 100000.
 *     If you want multiple elements, you should write it like this :
 *     <element_boost:elementId1 boost1
 *     elementId2 boost2
 *     elementId3 boost3
 *     etc.>
 *     Example :
 *     Notetag : <element_boost:1 100
 *     2 200>
 *     Result : Physical element will boost attacks 100 times, and Fire 200
 *              times.
 *     You can also use JS expressions as numbers.
 *     Example :
 *     Notetag <element_boost:1 $gameVariables.value(1)>
 *     Result :
 *     Physical element will boost attacks by value of variable iD 1.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - Game_Action :
 *    - multiplyElementBoost
 *
 * ALIASED :
 *  <None>
 *
 * OVERWRITTEN :
 *  - Game_Action :
 *    - makeDamageValue
 * ============================================================================
 */



//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

(function(){

Game_Action.prototype.makeDamageValue = function(target, critical)
{
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) value *= target.pdr;
    if (this.isMagical()) value *= target.mdr;
    if (baseValue < 0) value *= target.rec;
    if (critical) value = this.applyCritical(value);
    value *= this.multiplyElementBoost((this.subject().isActor() ? ($dataActors[this.subject().actorId()]) : ($dataEnemies[this.subject().enemyId()])).meta.element_boost);
    if(this.subject().isActor())
    {
    	value *= this.multiplyElementBoost(this.subject().currentClass().meta.element_boost);
    	for(var i = 0; i < this.subject().equips().length; ++i)if(this.subject().equips()[i])value *= this.multiplyElementBoost(this.subject().equips()[i].meta.element_boost);
    }
    for(var i = 0; i < this.subject().states().length; ++i) value *= this.multiplyElementBoost(this.subject().states()[i].meta.element_boost);
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

Game_Action.prototype.multiplyElementBoost = function(meta)
{
	if(meta)
	{
    var splitElements = meta.split("\n");
    console.log(splitElements);
		for(var i = 0; i < splitElements.length; ++i)
    {
      var metaSplit = splitElements[i].split(" ");
      console.log(metaSplit);
      if(this.item().damage.elementId === Number(eval(metaSplit[0])))return Number(eval(metaSplit[1]));
    }
		return 1;
	}
	else return 1;
}

})();
