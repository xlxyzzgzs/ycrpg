//=============================================================================
// SF_InputBindControl.js
//=============================================================================
/*:
 * @plugindesc v1.0 support remove input event listener 
 * @author SF
 * 
 * @help
 * ============================================================================
 * provide js function
 * 
 *      TouchInput.removeEventHandlers()
 *      Input.removeEventHandlers()
 * 
 * to remove input / touchinput event listener
 * ============================================================================
 * provide js function
 * 
 *      TouchInput._setupEventHandlers()
 *      Input._setupEventHandlers()
 * 
 * to rebind input / touchinput event listener
 * ============================================================================
 * provide plugin commmand
 * 
 *      SF-Remove-Event-Handlers TouchInput
 *      SF-Remove-Event-Handlers Input
 * 
 * to remove input / touchinput event listener
 * ============================================================================
 * provide plugin command
 * 
 *      SF-Setup-Event-Handlers TouchInput
 *      SF-Setup-Event-Handlers Input
 * 
 * to rebind input / touchinput event listener
 * ============================================================================
 * 
 * changelog
 * v1.0 complete the plugin
 * 
 */
var Imported = Imported || {};
Imported.SF_InputBindControl=true;

var SF_Plugins=SF_Plugins||{};

(function(){

	var SF_InputBindControl={};
	SF_Plugins.SF_InputBindControl=SF_InputBindControl;

    //remove input eventlistener
	TouchInput.removeEventHandlers = function() {
		var isSupportPassive = Utils.isSupportPassiveEvent();	
		document.removeEventListener('mousedown', this._onMouseDownBind);
		document.removeEventListener('mousemove', this._onMouseMoveBind);
		document.removeEventListener('mouseup', this._onMouseUpBind);
		document.removeEventListener('wheel', this._onWheelBind);
		document.removeEventListener('touchstart', this._onTouchStartBind);
		document.removeEventListener('touchmove', this._onTouchMoveBind);
		document.removeEventListener('touchend', this._onTouchEndBind);
		document.removeEventListener('touchcancel', this._onTouchCancelBind);
		document.removeEventListener('pointerdown', this._onPointerDownBind);
	};
	TouchInput._setupEventHandlers = function() {
		var isSupportPassive = Utils.isSupportPassiveEvent();
		this._onMouseDownBind=this._onMouseDown.bind(this);
		this._onMouseMoveBind=this._onMouseMove.bind(this);
		this._onMouseUpBind=this._onMouseUp.bind(this);
		this._onWheelBind=this._onWheel.bind(this);
		this._onTouchStartBind=this._onTouchStart.bind(this);
		this._onTouchMoveBind=this._onTouchMove.bind(this);
		this._onTouchEndBind=this._onTouchEnd.bind(this);
		this._onTouchCancelBind=this._onTouchCancel.bind(this);
		this._onPointerDownBind=this._onPointerDown.bind(this);
		document.addEventListener('mousedown', this._onMouseDownBind);
		document.addEventListener('mousemove', this._onMouseMoveBind);
		document.addEventListener('mouseup', this._onMouseUpBind);
		document.addEventListener('wheel', this._onWheelBind, isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchstart', this._onTouchStartBind, isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchmove', this._onTouchMoveBind, isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchend', this._onTouchEndBind);
		document.addEventListener('touchcancel', this._onTouchCancelBind);
		document.addEventListener('pointerdown', this._onPointerDownBind);
	};
	Input._setupEventHandlers = function() {
		this._onKeyDownBind=this._onKeyDown.bind(this);
		this._onKeyUpBind=this._onKeyUp.bind(this);
		this._onLostFocusBind=this._onLostFocus.bind(this);
		document.addEventListener('keydown', this._onKeyDownBind);
		document.addEventListener('keyup', this._onKeyUpBind);
		window.addEventListener('blur', this._onLostFocusBind);
	};
	
	Input.removeEventHandlers = function() {
		document.removeEventListener('keydown', this._onKeyDownBind);
		document.removeEventListener('keyup', this._onKeyUpBind);
		window.removeEventListener('blur', this._onLostFocusBind);
    };
    
    SF_InputBindControl.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command,args){
        SF_InputBindControl.Game_Interpreter_pluginCommand.call(this,command,args);
        if(command.toLowerCase()=="sf-remove-event-handlers"){
            if(args[0].toLowerCase()=="touchinput") TouchInput.removeEventHandlers();
            if(args[0].toLowerCase()=="input") Input.removeEventHandlers();
        }
        if(command.toLowerCase()=="sf-setup-event-handlers"){
            if(args[0].toLowerCase()=="touchinput") TouchInput._setupEventHandlers();
            if(args[0].toLowerCase()=="input") Input._setupEventHandlers();
        }
    };
    
})();