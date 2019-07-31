//=============================================================================
// Durability.js
//=============================================================================

/*:
 * @plugindesc Adds Minecraft-like durability of weapons/armors.
 * <KockaDurability>
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin allows you to manage durability of your weapons and
 * armors. It's very simple how durability is calculated :
 * 1) When you are attacked, your armor loses durability.
 * 2) When you attack, your weapons lose durability.
 * After your weapon/armor loses all durability it cracks and you don't
 * have it in equips anymore.
 *
 * This plugin is made self-initiative.
 * ============================================================================
 *                              	NOTETAGS
 * ============================================================================
 * There are three notetags :
 * - Weapon and Armor notetag :
 *     <durability:x>
 *   This sets initial weapon/armor durability to a certain value.
 *   Example : <durability:1>
 *   Weapon/Armor in which this is put has durability 1.
 *   If no durability is specified, item is indestructible.
 *
 * - Item and Skill notetags :
 *     <durability_use:x>
 *   This sets how many durability points are losed when this is used.
 *   Example : <durability_use:10>
 *   If this Item/Skill is used by actor, he loses 10 durability on his
 *   weapons. If this Item/Skill is used by enemy, actors which are attacked
 *   lose 10 durability points on their armor.
 *
 *     <durability_increase:[equips] increase>
 *   This sets how much durability will be regenerated.
 *   	[equips] - numbers separated with one space that modify which equips
 *   will that increasing effect.
 *   	increase - if it's a number it'll specify by how much will your equips
 *   regenerate durability. It can be also set to "MAX", and then it'll
 *   just set your durability to max value.
 *   Example :
 *   Notetag : <durability_increase:[1 2 3] 10>
 *   This will increase durability for your Weapon, Shield and Head by 10.
 *   Notetag : <durability_increase[2 3 4] MAX>
 *   This will set durability for your Shield, Head and Body to maximum.
 *
 * Since version 1.1.1 you can set variable durability use/increase.
 * You can now set to depend on HP, MP, TP damage or even some variable.
 * 	Example:
 *	Notetag : <durability_use:hpDamage>
 * 	Result : This skill consumes durability in same amount as damage dealt.
 *
 * 	Notetag : <durability_increase:$gameVariables.variable(1)>
 *	Result : This skill/item will regenerate durability equal amount as
 *  variable iD 1's value.
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial release
 * 1.1.0   | Added option for regenerating durability.									[Adlw]
 * 1.1.1   | Added option for variable durability use										[Ozuma]
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *	<None>
 *
 * ALIASED :
 *	- Game_Action :
 *		- apply
 *		- useItem
 *
 * OVERWRITTEN :
 *	<None>
 * ============================================================================
 * @param Weapons
 * @desc Specify what are your weapon slots here, separated by a space
 * @default 1
 *
 * @param Armors
 * @desc Specify what are your armor slots here, separated by a space
 * @default 2 3 4 5
 *
 * @param Default durability use
 * @desc How much durability points will item/skill take from weapon/armor
 * when none is specified?
 * @default 1
 *
 * @param Durability message
 * @desc What message will be displayed when weapon/armor cracks?
 * Set to empty to disable.
 * @default %1 cracked!
 */
(function(){



// Aliases
var _kocka_random_alias_apply_M7cAp2B8 = Game_Action.prototype.apply;
var _kocka_random_alias_useItem_eb8T3mP2 = Game_Actor.prototype.useItem;



// Parameters
var _plugin_params = $plugins.filter(function(p) { return p.description.contains('<KockaDurability>'); })[0].parameters;
var temp_weapons = _plugin_params["Weapons"];
var temp_armors = _plugin_params["Armors"];
var default_durability_use = Number(_plugin_params["Default durability use"]);
var durability_message = _plugin_params["Durability message"];



//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Game_Action.prototype.apply = function(target)
{
	_kocka_random_alias_apply_M7cAp2B8.apply(this, arguments);
	if(target.result().isHit())
	{
		var array = ((this.subject() instanceof Game_Actor) ? temp_weapons : temp_armors).split(" ");
		var actor = (this.subject() instanceof Game_Actor) ? this.subject() : target;
		for(var i = 0; i < array.length; ++i)
		{
			var equip = actor.equips()[array[i] - 1];
			if(equip)
			{
				if(!equip.durability)equip.durability = equip.meta.durability ? equip.meta.durability : -1;
				var hasDurability = equip.durability != -1;
				var result = target.result();
				var hpDamage = result.hpDamage;
				var mpDamage = result.mpDamage;
				var tpDamage = result.tpDamage;
				if(hasDurability)equip.durability -= this.item().meta.durability_use ? eval(this.item().meta.durability_use) : this.item().meta.durability_increase ? 0 : eval(default_durability_use);
				if(equip.durability <= 0 && hasDurability)
				{
					if(durability_message != "")$gameMessage.add(durability_message.format(equip.name));
					actor.changeEquipById(array[i], 0);
				}
			}
		}
	}
}

Game_Actor.prototype.useItem = function(item)
{
	_kocka_random_alias_useItem_eb8T3mP2.apply(this, arguments);
	if(item.meta.durability_increase)
	{
		var arr = /\[(.+)\]\s*(\w+)/ig.exec(item.meta.durability_increase);
		if(arr)
		{
			var equips = this.equips();
			var splitEquips = arr[1].split(" ");
			for(var i = 0; i < splitEquips.length; ++i)
			{
				var equip = equips[Number(splitEquips[i]) - 1];
				if(equip)
				{
					if(equip.meta.durability)
					{
						var maxDurability = Number(equip.meta.durability);
						if(!equip.durability)equip.durability = maxDurability;
						else
						{
							if(arr[2] === "MAX")equip.durability = maxDurability;
							else
							{
								equip.durability += Number(arr[2]);
								if(equip.durability > maxDurability)equip.durability = maxDurability;
							}
						}
					}
					else console.log("[Durability] You can't increase durability on equip that has no durability!");
				}
			}
		}
	}
}

})();
