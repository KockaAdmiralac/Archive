//=============================================================================
// HideTimer.js
//=============================================================================

/*:
 * @plugindesc Hides the timer
 * @author KockaAdmiralac
 *
 * @help
 * In "Timer Switch" define your switch that you'll turn on/off when you want
 * to turn timer display on/off.
 * 
 * For example, if "Timer Switch" is set to 10, and your switch #0010 is
 * OFF, then timer won't be displayed. Otherwise, it would.
 *
 * Made for this : http://goo.gl/jr69Ds
 *
 * @param Timer Switch
 * @desc The switch that turns displaying of the timer on/off
 * @default 1
 */
(function(){

var _kocka_random_alias_redraw_bFd0Pq5c = Sprite_Timer.prototype.redraw;

var timerSwitch = Number(PluginManager.parameters('HideTimer')['Timer Switch'] || 1);

Sprite_Timer.prototype.redraw = function()
{
	_kocka_random_alias_redraw_bFd0Pq5c.apply(this, arguments);
    if(!$gameSwitches.value(timerSwitch))this.bitmap.clear();
};


})()