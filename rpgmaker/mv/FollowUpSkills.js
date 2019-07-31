//=============================================================================
// FollowUpSkills.js
//=============================================================================

/*:
 * @plugindesc Adds skills that automatically happen one after another
 * @author KockaAdmiralac
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * This plugin allows you to implement when actor uses a skill to add on a new
 * skill after it. Skill after can have several conditions will it be followed
 * with another skill based on damage produced. You can also set the follow up
 * skill as free to use, and you will lose no MP then.
 *
 * This plugin is made for : http://goo.gl/79LHeO
 * ============================================================================
 *                              	NOTETAGS
 * ============================================================================
 * Skill Notetags :
 * - <follow_up:id>
 *     After this skill will skill with specified iD be used.
 * - <follow-free>
 *     Marks the follow-up skill as free to use.
 * - <follow-conditions> ... </follow-conditions>
 *     Between those two tags you can insert code that will be evaluated and
 *     based on result of that evaluation it'll be determined will follow-up
 *     skill be used or not. There are some variables you can use :
 *     - result - Result of the action
 *     - hit - Did previous skill hit?
 *     - miss - Did previous skill miss?
 *     - evade - Was previous skill evaded?
 *     - physical - Was previous skill physical?
 *     - drain - Did previous skill drain?
 *     - critical - Was previous skill critical?
 *     - damage - You can access three parameters of it.
 *       - damage.hp - HP damage
 *       - damage.mp - MP damage
 *       - damage.tp - TP damage
 *     - buffs
 *       - buffs.added - List of added buffs.
 *       - buffs.removed - List of removed buffs.
 *       - buffs.de - List of added debuffs
 *     You can also access $gameVariables, $gameActors etc.
 *     Example :
 *     Result : skill happens when previous skill has hit.
 *     Implementation :
 *     <follow-conditions>
 *     hit
 *     </follow-conditions>
 *
 *     Example :
 *     Result : skill happens when switch iD 1 is ON.
 *     Implementation :
 *     <follow-conditions>
 *     $gameSwitches.value(1)
 *     </follow-conditions>
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial release
 * 1.0.5   | Added conditions and free follow-ups										[Roguedeus]
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 *	NEW :
 *    - BattleManager :
 *      - evaluateFollowCondition
 *    - Game_Action :
 *      - setFree
 *    - Game_Actor :
 *      - followUp
 *
 *	ALIASED :
 *    - BattleManager :
 *      - endAction
 *      - startAction
 *      - getNextSubject
 *      - setup
 *      - invokeNormalAction
 *    - Game_Actor :
 *      - canPaySkillCost
 *      - paySkillCost
 *    - Game_Action :
 *			- initialize
 *
 * OVERWRITTEN :
 *    <None>
 * ============================================================================
 */
var Imported = Imported || {};

Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.FollowUpSkills = {
		version: [1, 0, 7],
		aliases: {
				BattleManager: {
						endAction: BattleManager.endAction,
						startAction: BattleManager.startAction,
						getNextSubject: BattleManager.getNextSubject,
						setup: BattleManager.setup,
						invokeNormalAction: BattleManager.invokeNormalAction
				},
				Game_Actor: {
						canPaySkillCost: Game_Actor.prototype.canPaySkillCost,
						paySkillCost: Game_Actor.prototype.paySkillCost
				},
				Game_Action: {
						initialize: Game_Action.prototype.initialize
				}
		}
};

(function(){



//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

BattleManager.setup = function(troopId, canEscape, canLose)
{
		Imported.Kocka.FollowUpSkills.aliases.BattleManager.setup.call(this, troopId, canEscape, canLose);
		this._followUp = {skill: -1, free: false, conditions: "true"};
};

BattleManager.startAction = function()
{
		Imported.Kocka.FollowUpSkills.aliases.BattleManager.startAction.call(this);
		if(this._subject instanceof Game_Actor)
		{
				var action = this._subject.currentAction();
				var followUp = action.item().meta.follow_up;
				if(followUp)
				{
						splitNote = action.item().note.split("\n");
						var condition = "";
						var started = false;
						for(var i = 0; i < splitNote.length; ++i)
						{
								var line = splitNote[i];
								if(started) /<\s*\/\s*follow\s*-\s*conditions\s*>/ig.exec(line) ? started = false : condition += line;
								else if(/<\s*follow\s*-\s*conditions\s*>/ig.exec(line))started = true;
						}
						var arr = /<\s*follow\s*-\s*free\s*>/ig.exec(action.item().note);
						this._followUp = { skill: Number(followUp), conditions: condition, free: Boolean(arr), instant: (Imported.YEP_InstantCast ? this._subject.isInstantCast(action.item()) : false)};
				}
		}
};

BattleManager.endAction = function()
{
		Imported.Kocka.FollowUpSkills.aliases.BattleManager.endAction.call(this);
		if(this._followUp.skill !== -1)this._subject.followUp(this._followUp.skill, this._followUp.free, this._followUp.instant);
		this._followUp = {skill: -1, conditions: "true", free: false, instant: false};
};

BattleManager.getNextSubject = function()
{
		if(this._followUp.skill !== -1)return this._subject;
		return Imported.Kocka.FollowUpSkills.aliases.BattleManager.getNextSubject.call(this);
};

BattleManager.invokeNormalAction = function(subject, target)
{
		Imported.Kocka.FollowUpSkills.aliases.BattleManager.invokeNormalAction.call(this, subject, target);
		var result = this.applySubstitute(target).result();
		if(!this.evaluateFollowCondition(target))this._followUp.skill = -1;
};

BattleManager.evaluateFollowCondition = function(target)
{
		if(!this._followUp.conditions)return true;
		var result = target.result();
		var hit = result.isHit();
		var miss = result.missed;
		var evade = result.evaded;
		var physical = result.physical;
		var drain = result.drain;
		var critical = result.critical;
		var damage = {hp: result.hpDamage, mp: result.mpDamage, tp: result.tpDamage};
		var buffs = {added: result.addedBuffs, removed: result.removedBuffs, de: result.addedDebuffs};
		var success = result.success;
		var followSkill = this._followUp.skill;
		var condition = this._followUp.conditions;
		return eval(condition);
};



//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Game_Action.prototype.setFree = function() { this.freeFollow = true; }

Game_Action.prototype.initialize = function(subject, forcing)
{
		Imported.Kocka.FollowUpSkills.aliases.Game_Action.initialize.call(this, subject, forcing);
		this.freeFollow = false;
}



//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype.followUp = function(skill, free, instant)
{
		this._lastFollowUp = {skill: skill, free: free, instant: instant};
		var action = new Game_Action(this, false);
		this.followInstant = instant;
		action.setSkill(skill);
		action._item.object().instantCast = instant;
		if(free)action.setFree();
		this._actions.unshift(action);
}

Game_Actor.prototype.canPaySkillCost = function(skill) { return Imported.Kocka.FollowUpSkills.aliases.Game_Actor.canPaySkillCost.call(this, skill) || ($gameParty.inBattle() ? this._actions[0].freeFollow : false); };

Game_Actor.prototype.paySkillCost = function(skill)
{
		if($gameParty.inBattle())
		{
				if(this._actions[0].freeFollow)return null;
				Imported.Kocka.FollowUpSkills.aliases.Game_Actor.paySkillCost.call(this, skill);
		}
};



})();
