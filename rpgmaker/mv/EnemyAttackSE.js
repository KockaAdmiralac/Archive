//=============================================================================
// EnemyAttackSE.js
//=============================================================================

/*:
 * @plugindesc Plays SE when certain enemy attacks.
 * @author KockaAdmiralac
 *
 * @help
 *
 * Enemy Notetag :
 *   - <attack_se:name pan pitch volume>
 *     Example :
 *     If you insert <attack_se:EvilLaugh 0 100 100> in Enemy named Witch, then
 *     when Witch attacks you will hear an SE of EvilLaugh with center panning,
 *     normal pitch and full volume.
 * 
 * Made for this : http://goo.gl/ALO01V
 */

(function(){

var _kocka_random_alias_start_action_pQm7Cg4f = BattleManager.startAction;

BattleManager.startAction = function()
{
    _kocka_random_alias_start_action_pQm7Cg4f.apply(this);
    var subject = this._subject;
    if(subject instanceof Game_Enemy)if(subject.currentAction().isAttack())if($dataEnemies[subject.enemyId()].meta.attack_se)
    {
    	var splitSe = $dataEnemies[subject.enemyId()].meta.attack_se.split(" ");
    	AudioManager.playSe({name: splitSe[0], pan: splitSe[1], pitch: splitSe[2], volume: splitSe[3]});
    }
};


})();