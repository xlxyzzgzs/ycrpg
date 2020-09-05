//Change for use d-pad 

/*:
 * @plugindesc v3.0 Creates buttons on the screen for touch input
 * @author Aloe Guvner
 * 
 * 
 * @param dPadSettings
 * @text D-Pad Settings
 * @type struct<dpad>
 * @desc Settings for the D-Pad.
 * 
 * @param keyButtonSettings
 * @text Key Button Settings
 * @type struct<keyButton>[]
 * @desc Settings for on-screen buttons that simulate key presses.
 * 
 * @param controlButtonSettings
 * @text Control Button Settings
 * @type struct<controlButton>
 * @desc A "toggle" button that allows players to turn the UI
 * on and off.
 * 
 * @param fadeDuration
 * @text Fade Duration
 * @desc Duration of hiding the buttons (number of frames)
 * for the buttons to fade and un-fade.
 * @default 20
 * @type number
 *
 * @param fadeDelay
 * @text Fade Delay
 * @desc Delay before hiding and unhiding buttons (number
 * of frames)
 * @default 1
 * @type number
 *
 *
 *
 * @param enableDiagonalInput
 * @text Enable Diagonal Input
 * @type boolean
 * @desc If the player touches in the corners of the D-Pad, both
 * direction inputs are recorded. See info in help file.
 * @default false
 *
 * @param hideButtonsDuringDialogue
 * @text Hide Buttons During Dialogue
 * @type boolean
 * @desc Hide the virtual buttons during event dialogue.
 * @default true
 *
 * @param enableDPadDebugWindow
 * @text Enable DPad Debug Window
 * @type boolean
 * @desc Shows a window with the current D-Pad state. For 
 * plugin debugging only.
 * @default false
 * 
 * @help
 * 
 * //=============================================================================
 * // Background: 
 * //=============================================================================
 * This plugin focuses on improving the user interface for mobile games created
 * in RPG Maker MV. This plugin allows the developer  to have virtual buttons 
 * on the screen that interact with touch input. 
 * 
 * This plugin allows maximum flexibility for the developer, you can add 
 * as many or as few buttons as you want to the screen, and you can add these buttons 
 * on whichever screens you would like (i.e. map, menu, credits, title, etc.).
 * 
 * //=============================================================================
 * // Functionality:
 * //=============================================================================
 * 
 * This plugin can create 3 different types of buttons:
 * -Directional Pad
 * --A single picture which is used for up, left, right, and down movement.
 * --The picture is divided into 9 sections. The top 3 sections trigger the "up"
 * input, the left 3 sections trigger the "left" input, the right 3 sections
 * trigger the "right" input, and the bottom 3 section triggers the "down" input.
 * --The middle section does not trigger any input.
 * --The scenes that this button appears in can be defined.
 * --This button is not mandatory.
 * 
 * -Key buttons
 * --These buttons can be used to represent any key. Common keys to use would be
 * "ok" , "escape", "pagedown", "pageup".
 * --However, these can be any key, and there can be as many or as few as the developer
 * would like.
 * --Additionally, the scenes that these buttons appear in can be controlled individually.
 * 
 * 
 * -Control button 
 * --The control button, if pressed, will collapse and hide other buttons on the screen.
 * --If pressed again, it will expand and show other buttons on the screen.
 * --You can configure which other buttons are affected. This can allow you to create 
 *   a dynamic menu where pressing this button opens other buttons for "Items", "Save",
 *   etc., while leaving the DPad or any other button active all of the time.
 * --The scenes that this button appears in can be defined.
 * --This button is not mandatory.
 * 
 * //=============================================================================
 * // Touch Input Methods:
 * //=============================================================================
 *
 * The following methods can be chosen for any of the key buttons. The default
 * method is "triggered".
 *
 * Triggered:
 *   This input method occurs when the button is just pressed down. It occurs only
 * once, in the same frame that the button was pressed.
 *
 * Pressed:
 *   This input method occurs every frame while the button is pressed down. Any action
 * that this button is doing will execute every frame (60 frames per second)
 *
 * Repeated:
 *   This input method occurs after 24 frames from when the button is pressed, and
 * then occurs every 6 frames while the button is still pressed.
 *
 * Long Pressed:
 *   This input method occurs after 24 frames from when the button is pressed, and
 * then occurs every frame while the button is still pressed.
 *
 * Released:
 *   This input method occurs when the button is no longer being pressed.
 *
 * //=============================================================================
 * // Setup:
 * //=============================================================================
 * This plugin requires a new folder to be created within the project "img" folder.
 * The folder must be titled "VirtualButtons".
 * Place all UI button images into this folder, and they can be accessed from the 
 * plugin parameters.
 *
 * //=============================================================================
 * // Vibrate Parameter
 * //=============================================================================
 * Buttons can trigger a vibrate on the mobile device when pressed, controlled by
 * a parameter.
 * This parameter follows a pattern of vibrate,pause,vibrate,pause, etc.
 * Separate each time interval by a comma.
 * Examples:
 * 200 --> vibrate for 200ms
 * 100,30,100,30,100,30  --> vibrate for 100ms, pause for 30ms; repeat 2 more times
 *
 * Note that most devices support the Vibration API, but not all.
 * Additionally, this may not work in all methods of deployment.
 * 
 * 
 * 
 * //=============================================================================
 * Diagonal Movement Parameter
 * //=============================================================================
 *
 * There is a parameter that controls whether diagonal input is recorded from the
 * D-Pad. This is not a diagonal movement plugin! This parameter merely controls
 * whether touching on the top left will add the input values of both "top" and
 * "left" to the input state. Other diagonal movement plugins would consume these
 * input values to move the character diagonally.
 *
 * If your game uses diagonal movement, this parameter must be on. If your game
 * does not use diagonal movement, it is recommended to turn this parameter off.
 * 
 * //=============================================================================
 * Terms of Use:
 * //=============================================================================
 * Free for use in commercial or non-commercial projects.
 * Credits required to: Aloe Guvner
 * 
 * //=============================================================================
 * Version History:
 * //=============================================================================
 * v2.0.1 (May 13 2019)
 * --Fix bug where DPad got stuck in menus
 * v2.0.0 (May 4 2019)
 * --Clears input state on transfer to mitigate stuck DPad input bug
 * --Improves clearing of input state each frame to mitigate bug
 * --Fix bug where the DPad would not clear the direction after a parallel event 
 *   checking for a input direction triggered a Show Choices event command
 * --Add plugin parameter to toggle whether the buttons are hidden during dialogue
 * --Plugin command to change button opacity
 * --Plugin command option to hide all buttons
 * --Plugin command option to show all buttons
 * --Delay parameter to fade-in
 * --Option to use a "hot" image that shows when the button is pressed
 * --Key buttons can trigger common events
 * --Buttons hidden via plugin command will stay hidden until the show plugin command
 * v1.4.0 (December 13 2018)
 * --Added ability to configure which buttons are affected by the "control" button
 *   Can be used to create dynamic menus.
 * v1.3.1 (October 30 2018)
 * --Added a parameter to control whether diagonal movement is detected as a
 *   possible fix for a hard to reproduce movement bug.
 * v1.3.0 (September 27 2018)
 * --Added a parameter to choose to disable the normal touch input on any chosen
 *   scene. The only touch input enabled on these scenes is the mobile UI.
 * v1.2.3 (September 27 2018)
 * --Fixed a bug where buttons that the player had chosen to hide would reappear
 *   after a game message.
 * v1.2.2 (September 27 2018)
 * --Fixed a bug where buttons could be pressed before they were fully visible
 * v1.2.1 (September 27 2018)
 * --Added an "instant" feature to hide/show for smoother cutscene transitions
 * v1.2.0 (August 26 2018)
 * --Added ability to vibrate when button is pressed
 * v1.1.0 (June 27 2018)
 * --Fixed bug with awkward player movement on the DPad
 * --Added ability to specify the type of touch input on key buttons
 * v1.0.3 (May 14 2018)
 * --Added ability to run custom code when a key button is pressed
 * v1.0.2 (May 9 2018)
 * --Added ability to play a sound effect when a button is pressed
 * --Fixed a bug where the parameters weren't read correctly due to plugin name change
 * --Fixed a bug where the control button didn't hide the dpad properly
 * v1.0.1 (May 8 2018)
 * --Added a version compatible with MV earlier than 1.6.0 using Babel.js
 * v1.0.0 (April 17 2018)
 * --Initial release
 * 
 * //=============================================================================
 * End of Help File
 * //=============================================================================
 */

/*~struct~dpad:
 * @param rockerImage
 * @text rockerImage
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the D-Pad rocker image
 * @require 1
 *
 * @param pressedpointimage
 * @text pressedpointimage
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the D-Pad rocker point image
 * @require 1
 * 
 * @param padImage
 * @text padImage
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the button image
 * @require 1
 *  * 
 * @param x
 * @text X
 * @desc X position of the D-Pad. Formulas are allowed.
 * (ex. Graphics.width - 96)
 * @type text
 * @default 0
 * 
 * @param y
 * @text Y
 * @desc Y position of the D-Pad. Formulas are allowed.
 * (ex. Graphics.height - 96)
 * @type text
 * @default 0
 * 
 * @param soundEffect
 * @text Sound Effect
 * @type struct<soundEffect>
 * @desc Sound Effect to play when button is pressed.
 * Depending on scenario, SE might already play. Test first.
 * 
 * @param Use Dynamic roker
 * @text Use Dynamic roker(need)
 * @desc Use Dynamic roker need pressedPoint (must set true)
 * @type boolean
 * @default false
 * 
 * @param Dynamic rocker back img
 * @text Dynamic rocker back img
 * @desc Dynamic rocker Rectangle limit (must set it)
 * @type file
 * @dir img/VirtualButtons
 * @require 1
 * 
 * @param Rectangle X
 * @text Rectangle Left position
 * @type text
 * @default 0
 * @desc Rectangle left position use for Dynamic rocker
 * 
 * @param Rectangle Y
 * @text Rectangle Top position
 * @type text
 * @default 0
 * @desc Rectangle top position use for Dynamic rocker
 * 
 * 
 */

/*~struct~keyButton:
 * @param name
 * @text Name
 * @type text
 * @desc The name of the button
 * 
 * @param inputMethod
 * @text Input Method
 * @type select
 * @option Triggered
 * @value 0
 * @option Pressed
 * @value 1
 * @option Repeated
 * @value 2
 * @option Long Pressed
 * @value 3
 * @option Released
 * @value 4
 * @desc The type of touch input that will trigger the button.
 * See the help file for full descriptions of the options.
 * @default 0
 * 
 * @param inputTrigger
 * @text Input Code
 * @type text
 * @desc The input code triggered when the button is pressed.
 * ex. ok / escape / pagedown / pageup
 * 
 * @param image
 * @text Image
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the button image
 * @require 1
 * 
 * @param hotImage
 * @text Hot Image
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the "Hot" button image
 * This image shows while the button is being pressed
 * @require 1
 * 
 * 
 * @param x
 * @text X
 * @type text
 * @desc X position of the button. Formulas are allowed.
 * (ex. Graphics.width - 96)
 * @default 0
 * 
 * @param y
 * @text Y
 * @type text
 * @desc Y position of the button. Formulas are allowed.
 * (ex. Graphics.height - 96)
 * @default 0
 * 
 * @param soundEffect
 * @text Sound Effect
 * @type struct<soundEffect>
 * @desc Sound Effect to play when button is pressed.
 * Depending on scenario, SE might already play. Test first.
 * 
 * @param commonEvent
 * @text Common Event
 * @type number
 * @desc Common Event to trigger when the button is pressed.
 * @default 0
 * @min 0
 * 
 * @param customCode
 * @text Custom Code
 * @type note
 * @desc Custom Javascript code to run on button press.
 * Use the 'this' keyword to refer to the current scene.
 * 
 * @param vibratePattern
 * @text Vibrate Pattern
 * @type text
 * @default 0
 * @desc Pattern of miliseconds to vibrate on press.
 * Use 0 for no vibration. See help for more info.
 */

/*~struct~controlButton:
 * @param image
 * @text Image
 * @type file
 * @dir img/VirtualButtons
 * @desc File path for the button image
 * @require 1
 *  * 
 * @param x
 * @text X
 * @type text
 * @desc X position of the button. Formulas are allowed.
 * (ex. Graphics.width - 96)
 * @default 0
 * 
 * @param y
 * @text Y
 * @type text
 * @desc Y position of the button. Formulas are allowed.
 * (ex. Graphics.height - 96)
 * @default 0
 * 
 * @param soundEffect
 * @text Sound Effect
 * @type struct<soundEffect>
 * @desc Sound Effect to play when button is pressed.
 * Depending on scenario, SE might already play. Test first.
 * 
 * @param buttonsToHide
 * @text Buttons To Show / Hide
 * @type text[]
 * @desc A list of the Key Buttons to show and hide when
 * this button is pressed. Leave empty to hide all.
 * @default []
 * 
 * @param hideDPad
 * @text Show / Hide DPad?
 * @type boolean
 * @desc Controls whether the DPad is affected when
 * this button is pressed.
 * @default true
 * 
 * @param inputMethod
 * @text Input Method
 * @type select
 * @option Triggered
 * @value 0
 * @option Pressed
 * @value 1
 * @option Repeated
 * @value 2
 * @option Long Pressed
 * @value 3
 * @option Released
 * @value 4
 * @desc The type of touch input that will trigger the button.May can't use
 * See the help file for full descriptions of the options.
 * @default 0
 * 
 */

/*~struct~soundEffect:
 * @param name
 * @text Sound Effect Name
 * @type file
 * @dir audio/se
 * @desc Sound effect to play when the button is pressed.
 * @default
 * @require 1
 * 
 * @param volume
 * @text Volume
 * @type number
 * @min 0
 * @max 100
 * @desc Volume of the sound effect, in %
 * Allowed values: 0% - 100%
 * @default 90
 * 
 * @param pitch
 * @text Pitch
 * @type number
 * @min 50
 * @max 150
 * @desc Pitch of the sound effect, in %
 * Allowed values: 50% - 150%
 * @default 100
 * 
 * @param pan
 * @text Pan
 * @type number
 * @min -100
 * @max 100
 * @desc Pan of the sound effect
 * Allowed values: -100 - 100
 * @default 0
 * 
 */
var Imported=Imported||{};
Imported.VituralButtons_OnlyForSelf=true;
var ALOE=ALOE||{};
(function () {
	"use strict";

	var Alias = {};
	var Parameters = {};
	//=============================================================================
	// Utils
	//=============================================================================
	// Create a utility function to parse complex parameters.
	//=============================================================================

	ALOE.recursiveParse = function (param) {
		try {
			return JSON.parse(param, function (key, value) {
				try {
					return this.recursiveParse(value);
				} catch (e) {
					return value;
				}
			}.bind(this));
		} catch (e) {
			return param;
		}
	}; //=============================================================================
	// Parameters
	//=============================================================================
	// Read and parse parameters into a locally scoped Parameters object.
	//=============================================================================


	Object.keys(PluginManager.parameters("VirtualButtons_OnlyForSelf")).forEach(function (a) {
		return (Parameters[a] = ALOE.recursiveParse(PluginManager.parameters("VirtualButtons_OnlyForSelf")[a]));
	}); //=============================================================================
	// ImageManager
	//=============================================================================
	// Load and reserve virtual button images.
	//=============================================================================

	ImageManager.loadVirtualButton = function (filename, hue) {
		return this.loadBitmap('img/VirtualButtons/', filename, hue, true);
	};

	ImageManager.reserveVirtualButton = function (filename, hue, reservationId) {
		return this.reserveBitmap('img/VirtualButtons/', filename, hue, true, reservationId);
	}; //=============================================================================
	// Sprite_VirtualButton
	//=============================================================================
	// Sprite for the UI button(s)
	// Parent class for Sprite_DirectionalPad, Sprite_KeyButton, Sprite_ControlButton
	//=============================================================================


	function Sprite_VirtualButton() {
		this.initialize.apply(this, arguments);
	}

	Sprite_VirtualButton.prototype = Object.create(Sprite_Base.prototype);
	Sprite_VirtualButton.prototype.constructor = Sprite_VirtualButton;

	Sprite_VirtualButton.prototype.initialize = function (x, y, normalImage, soundEffect, vibratePattern, hotImage) {
		Sprite_Base.prototype.initialize.call(this);

		if (normalImage) {
			this.bitmap = ImageManager.loadVirtualButton(normalImage);
			this.normalImage = this.bitmap;
		}

		if (hotImage) {
			this.hotImage = ImageManager.loadVirtualButton(hotImage);
		}

		if (soundEffect) {
			this._soundEffect = soundEffect;
		}

		if (vibratePattern) {
			if (!window.navigator.vibrate) {
				this._vibratePattern = 0;
			} else if (typeof vibratePattern === 'number') {
				this._vibratePattern = vibratePattern;
			} else {
				this._vibratePattern = vibratePattern.split(',').map(Number);
			}
		}

		if (isNaN(x)) {
			x = eval(x);
		}

		if (isNaN(y)) {
			y = eval(y);
		}

		this.move(x, y);
		this._start = new Point(null, null);
		this._distance = new Point(null, null);
		this._destination = new Point(null, null);
		this._velocity = new Point(null, null);
		this._origin = new Point(x, y);
		this._hiding = false;
		this._showing = false;
		this._duration = Parameters.fadeDuration;
		this._delay = Parameters.fadeDelay;
		this._delayCounter = 0;
		this.active = true;
		this._pluginHidden = false;
		this.z = 5;

		this._point = null;
		this._lastPoint = null;
		this._TouchID=null;
	};

	Sprite_VirtualButton.prototype.update = function () {
		Sprite_Base.prototype.update.call(this);

		if(this.active) this.updatePressPoint();
		else {
			if(this._TouchID!=null){
				delete Alias.TouchIdUsed[this._TouchID];
			}
			this._TouchID=null;
			this._lastPoint=null;
			this._point=null;
		}

		if (this.active && !this.moving) {
			this.updateTouchInput();
		}

		if (this.active && this.updateHotImage) {
			this.updateHotImage();
		}

		if (this.moving) {
			this.updatePosition();
		}

		if (!this.active) {
			this.updateActive();
		}
	};

	Sprite_VirtualButton.prototype.updatePressPoint = function () {
		this._lastPoint = this._point;
		this._point = this.GetPressPoint();
		if (this._point) {
			if (!!this._lastPoint) {
				this._trigger = false;
			} else {
				this._trigger = true;
			}
			this._pressed = true;
			this._pressCount++;
		} else {
			this._pressed = false;
			this._pressCount = 0;
			if (!!this._lastPoint) {
				this._released = true;
			} else {
				this._released = false;
			}
		}
	};

	Sprite_VirtualButton.prototype.updateTouchInput = function () {};

	Sprite_VirtualButton.prototype.updateHotImage = function () {
		if (this._pressed) {
			var point = this._point;

			if (this.containsPoint(point)) {
				if (this.hotImage) {
					this.bitmap = this.hotImage;
				}
			}
		} else {
			if (this.bitmap !== this.normalImage) {
				this.bitmap = this.normalImage;
			}
		}
	};

	Sprite_VirtualButton.prototype.updateVisibility = function () {
		if (this._hiding && this.opacity > 0) {
			if (this._delayCounter < this._delay) {
				this._delayCounter++;
			} else {
				this.opacity -= 255 / this._duration;
				if (this.opacity <= 0) {
					this._delayCounter = 0;
					this._showing = false;
				}
			}
		} else if (this._showing && this.opacity < 255) {
			if (this._delayCounter < this._delay) {
				this._delayCounter++;
			} else {
				this.opacity += 255 / this._duration;
				if (this.opacity >= 255) this._delayCounter = 0;
			}
		}
	};

	Sprite_VirtualButton.prototype.updateActive = function () {
		if (this.opacity === 255 && !this.moving && !this._pluginHidden &&!this._hiding) {
			this.active = true;
		}
	};

	Sprite_VirtualButton.prototype.updatePosition = function () {
		this.x += this._velocity.x;
		this.y += this._velocity.y;
		var currentPos = new Point(this.x, this.y);
		var currentDistance = this.absDistance(this._start, currentPos);

		if (currentDistance >= this._distance.abs) {
			this.x = this._destination.x;
			this.y = this._destination.y;
			this._velocity.x = 0;
			this._velocity.y = 0;
			this.moving = false;
		}
	};

	Sprite_VirtualButton.prototype.hide = function () {
		this._hiding = true;
		this.active = false;
	};

	Sprite_VirtualButton.prototype.show = function () {
		this._hiding = false;
		this._showing = true;
	};

	Sprite_VirtualButton.prototype.hideInstant = function () {
		this._hiding = true;
		this.opacity = 0;
		this.active = false;
		this._delayCounter = this._delay;
	};

	Sprite_VirtualButton.prototype.showInstant = function () {
		this._hiding = false;
		this._showing = true;
		this.opacity = 255;
		this.active = true;
		this._delayCounter = this._delay;
	};

	Sprite_VirtualButton.prototype.collapse = function (x, y) {
		this._destination.x = x;
		this._destination.y = y;
		this._start.x = this.x;
		this._start.y = this.y;
		this._distance.x = this._destination.x - this._start.x;
		this._distance.y = this._destination.y - this._start.y;
		this._distance.abs = this.absDistance(this._destination, this._start);
		this._velocity.x = this._distance.x / this._duration;
		this._velocity.y = this._distance.y / this._duration;
		this.moving = true;
	};

	Sprite_VirtualButton.prototype.expand = function () {
		this._destination.x = this._origin.x;
		this._destination.y = this._origin.y;
		this._start.x = this.x;
		this._start.y = this.y;
		this._distance.x = this._destination.x - this._start.x;
		this._distance.y = this._destination.y - this._start.y;
		this._distance.abs = this.absDistance(this._destination, this._start);
		this._velocity.x = this._distance.x / this._duration;
		this._velocity.y = this._distance.y / this._duration;
		this.moving = true;
	};

	Sprite_VirtualButton.prototype.absDistance = function (pos1, pos2) {
		return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
	};


	Sprite_VirtualButton.prototype.GetPressPoint = function () {
		var i;
		var touches = TouchInput._event;
		var touch = null;
		var point = null;
		var x=null;
		var y=null;
		if (window.TouchEvent && touches instanceof TouchEvent) {
			if (this._TouchID!=null) {
				touches = TouchInput._event.targetTouches;
				for (i = 0; i < touches.length; i++) {
					touch = touches.item(i);
					if (this._TouchID != touch.identifier) {
						continue;
					}
					x = Graphics.pageToCanvasX(touch.pageX);
					y = Graphics.pageToCanvasY(touch.pageY);
					return new Point(x, y);
				}
			}
			if(SceneManager._scene._directionalPadDynamic&&
				SceneManager._scene._directionalPadDynamic.active&&
				(this==SceneManager._scene._directionalPad||
					this==SceneManager._scene._directionalPadPoint)){
				//Nothing to do
				//console.log("skip");
			} else {
				touches = TouchInput._event.targetTouches;
				for (i = 0; i < touches.length; i++) {
					touch = touches.item(i);
					if (!touch) continue;
					x = Graphics.pageToCanvasX(touch.pageX);
					y = Graphics.pageToCanvasY(touch.pageY);
					point = new Point(x, y);
					if (this.containsPoint(point)&&!Alias.TouchIdUsed[touch.identifier]) {
						if((SceneManager._scene._controlButton&&
							SceneManager._scene._controlButton.active&&
							SceneManager._scene._controlButton.containsPoint(point)&&
							SceneManager._scene._controlButton!=this)) {continue ;}
						Alias.TouchIdUsed[touch.identifier]=this;
						this._TouchID=touch.identifier;
						return point;
					}
				}
			}
		} else if (touches instanceof MouseEvent && TouchInput.isPressed()) {
			touch = touches;
			x = Graphics.pageToCanvasX(touch.pageX);
			y = Graphics.pageToCanvasY(touch.pageY);
			point = new Point(x, y);
			if(TouchInput.isPressed()&&Alias.MouseUsed==this){
				return point;
			} else if(SceneManager._scene._directionalPadDynamic&&
				SceneManager._scene._directionalPadDynamic.active&&
				(this==SceneManager._scene._directionalPad||
					this==SceneManager._scene._directionalPadPoint)){
						//Noting to do
			}else if(!Alias.MouseUsed&&TouchInput.isPressed()&&this.containsPoint(point)){
				if((SceneManager._scene._controlButton&&
					SceneManager._scene._controlButton.active&&
					(SceneManager._scene._controlButton==Alias.MouseUsed||
						SceneManager._scene._controlButton.containsPoint(point))&&
					SceneManager._scene._controlButton!=this)) {
						//Nothing to do
				} else {
					Alias.MouseUsed=this;
					return point;
				}
			}
			return;
		}
		Alias.MouseUsed=null;
		delete Alias.TouchIdUsed[this._TouchID];
		this._TouchID=null;
		return;
	};


	Sprite_VirtualButton.prototype.GetCenterPoint = function () {
		return new Point(this.x + this.width / 2, this.y + this.height / 2);
	};

	Sprite_VirtualButton.prototype.isTouchTriggered = function () {
		switch (this._inputMethod) {
			case 0:
				// Was just pressed
				return this._trigger;

			case 1:
				//Currently pressed down
				return this._pressed;

			case 2:
				//Is repeated
				return this._pressed && (this._trigger ||
					(this._pressCount >= TouchInput.keyRepeatWait &&
						this._pressCount % TouchInput.keyRepeatInterval === 0));

			case 3:
				//Is kept pressed
				return this._pressed && this._pressCount >= TouchInput.keyRepeatWait;

			case 4:
				//Was just released
				return this._released;

			default:
				return this._trigger;
		}
	};

	//=============================================================================
	// Sprite_DirectionalPad
	//=============================================================================
	// Sprite for the Directional Pad
	//=============================================================================


	function Sprite_DirectionalPad() {
		this.initialize.apply(this, arguments);
	}

	Sprite_DirectionalPad.prototype = Object.create(Sprite_VirtualButton.prototype);
	Sprite_DirectionalPad.prototype.constructor = Sprite_DirectionalPad;

	Sprite_DirectionalPad.prototype.initialize = function (x, y, image, hotImage, soundEffect) {
		Sprite_VirtualButton.prototype.initialize.call(this, x, y, image, soundEffect, undefined, hotImage);
		this._lastInput = "";
		this._hiding = false;
	};

	Sprite_DirectionalPad.prototype.updateTouchInput = function () {
		this.clearLastDirection();
		var point = null;
		if (Alias.globalShowStates.controlMethod=="fixed rocker"||
		Alias.globalShowStates.controlMethod=="dynamic rocker") { 
			point = SceneManager._scene._directionalPadPoint._point;
		} else if (Alias.globalShowStates.controlMethod=="fixed button"){ //否则
			point = this._point;
		}
		if (point) {
			if (this._soundEffect) {
				AudioManager.playSe(this._soundEffect);
			}
			var index = this.whichIndex(point);
			switch (index) {
				case 0:
					if (Parameters.enableDiagonalInput) {
						Input._currentState.up = true;
						Input._currentState.left = true;
						this._lastInput = "up-left";
					}
					break;
				case 1:
					Input._currentState.up = true;
					this._lastInput = "up";
					break;
				case 2:
					if (Parameters.enableDiagonalInput) {
						Input._currentState.right = true;
						Input._currentState.up = true;
						this._lastInput = "up-right";
					}
					break;
				case 3:
					Input._currentState.left = true;
					this._lastInput = "left";
					break;
				case 4:
					break;
				case 5:
					Input._currentState.right = true;
					this._lastInput = "right";
					break;
				case 6:
					if (Parameters.enableDiagonalInput) {
						Input._currentState.left = true;
						Input._currentState.down = true;
						this._lastInput = "down-left";
					}
					break;
				case 7:
					Input._currentState.down = true;
					this._lastInput = "down";
					break;
				case 8:
					if (Parameters.enableDiagonalInput) {
						Input._currentState.down = true;
						Input._currentState.right = true;
						this._lastInput = "down-right";
					}
					break;
				default:
					break;
			}
		}
	};

	Sprite_DirectionalPad.prototype.whichIndex = function (point) {
		// 2 1 0
		// 5 4 3
		// 8 7 6
		var index = 0;
		if (Alias.globalShowStates.controlMethod=="fixed rocker"||
		Alias.globalShowStates.controlMethod=="dynamic rocker") {
			var centerX = this.x + this.width / 2;
			var centerY = this.y + this.height / 2;
			var range = this.absDistance(point, this.GetCenterPoint());
			if (range < Math.max(this.width / 6, this.height / 6)) {
				return 4;
			}
			if (centerX == point.x) {
				return centerY == point.y ? 4 : (centerY > point.y ? 7 : 1);
			}
			var rad = Math.atan((point.y - centerY) / (point.x - centerX)) / Math.PI * 180;
			rad = point.x < centerX ? rad : rad + 180;
			rad = rad < 0 ? rad + 360 : rad;
			if (rad < 22.5 || rad > 360 - 22.5) {
				return 3;
			} else if (rad > 22.5 && rad < 22.5 + 45) {
				return 0;
			} else if (rad > 22.5 + 45 && rad < 22.5 + 45 * 2) {
				return 1;
			} else if (rad > 22.5 + 45 * 2 && rad < 22.5 + 45 * 3) {
				return 2;
			} else if (rad > 22.5 + 45 * 3 && rad < 22.5 + 45 * 4) {
				return 5;
			} else if (rad > 22.5 + 45 * 4 && rad < 22.5 + 45 * 5) {
				return 8;
			} else if (rad > 22.5 + 45 * 5 && rad < 22.5 + 45 * 6) {
				return 7;
			} else if (rad > 22.5 + 45 * 6 && rad < 22.5 + 45 * 7) {
				return 6;
			} else {
				return 4;
			}
		} else if (Alias.globalShowStates.controlMethod=="fixed button"){ //否则
			index += point.x - this.x > this.width / 3 ? point.x - this.x > this.width * 2 / 3 ? 2 : 1 : 0;
			index += point.y - this.y > this.height / 3 ? point.y - this.y > this.height * 2 / 3 ? 6 : 3 : 0;
		}
		return index;
	};

	Sprite_DirectionalPad.prototype.clearLastDirection = function () {
		if (this._lastInput) {
			this._lastInput.split("-").forEach(function (direction) {
				return (Input._currentState[direction] = false);
			});
			this._lastInput = "";
		}
	};

	//=============================================================================
	// Sprite_DirectionalPadPoint
	//=============================================================================
	// Sprite for the Directional Pad Press Point
	//=============================================================================
	function Sprite_DirectionalPadPoint() {
		this.initialize.apply(this, arguments);
	}

	Sprite_DirectionalPadPoint.prototype = Object.create(Sprite_VirtualButton.prototype);
	Sprite_DirectionalPadPoint.prototype.constructor = Sprite_DirectionalPad;

	Sprite_DirectionalPadPoint.prototype.initialize = function (image) {
		Sprite_VirtualButton.prototype.initialize.call(this, 0, 0, image, undefined, undefined, undefined);
		this.followLeft = 10;
		var x = SceneManager._scene._directionalPad.x;
		var y = SceneManager._scene._directionalPad.y;
		var width = SceneManager._scene._directionalPad.width;
		var height = SceneManager._scene._directionalPad.height;
		this._origin = new Point(x + width / 2 - this.width / 2, y + height / 2 - this.height / 2);
		this._TouchID = null;
	};

	Sprite_DirectionalPadPoint.prototype.updateTouchInput = function () {
		var x = SceneManager._scene._directionalPad.x;
		var y = SceneManager._scene._directionalPad.y;
		var width = SceneManager._scene._directionalPad.width;
		var height = SceneManager._scene._directionalPad.height;
		var point = this._point;
		if (point) {
			this.x = point.x - this.width / 2;
			this.y = point.y - this.height / 2;
		} else {
			this.x = x + width / 2 - this.width / 2;
			this.y = y + height / 2 - this.height / 2;
		}
	};

	Sprite_DirectionalPadPoint.prototype.updatePosition = function () {
		var x = SceneManager._scene._directionalPad.x;
		var y = SceneManager._scene._directionalPad.y;
		var width = SceneManager._scene._directionalPad.width;
		var height = SceneManager._scene._directionalPad.height;
		var currentPos = new Point(x + width / 2 - this.width / 2, y + height / 2 - this.height / 2);
		var currentDistance = this.absDistance(this._start, currentPos);
		this.x = currentPos.x;
		this.y = currentPos.y;

		if (currentDistance >= this._distance.abs) {
			this.x = this._destination.x;
			this.y = this._destination.y;
			this._velocity.x = 0;
			this._velocity.y = 0;
			this.moving = false;
		}
	};

	//=============================================================================
	// Sprite_DirectionalPadDynamic
	//=============================================================================
	// Sprite for the Directional Pad Dynamic
	//=============================================================================
	function Sprite_DirectionalPadDynamic() {
		this.initialize.apply(this, arguments);
	}

	Sprite_DirectionalPadDynamic.prototype = Object.create(Sprite_VirtualButton.prototype);
	Sprite_DirectionalPadDynamic.prototype.constructor = Sprite_DirectionalPad;

	Sprite_DirectionalPadDynamic.prototype.initialize = function (x,y,image) {
		Sprite_VirtualButton.prototype.initialize.call(this, x, y, image, undefined, undefined, undefined);
		this._TouchID=null;
	};

	Sprite_DirectionalPadDynamic.prototype.updateTouchInput = function () {
		var padPoint=SceneManager._scene._directionalPadPoint;
		var pad = SceneManager._scene._directionalPad;
		var button = SceneManager._scene._directionalPadButton;
		if(Alias.globalShowStates.controlMethod=="dynamic rocker"){
			if(this._TouchID!=null&&padPoint._TouchID==null){
				padPoint._TouchID=this._TouchID;
				Alias.TouchIdUsed[this._TouchID]=padPoint;
				pad.x=this._point.x-pad.width/2;
				pad.y=this._point.y-pad.height/2;
				padPoint.update();
			} else if(Alias.MouseUsed==this){
				Alias.MouseUsed=padPoint;
				pad.x=this._point.x-pad.width/2;
				pad.y=this._point.y-pad.height/2;
				padPoint.update();
			}
		} else if(Alias.globalShowStates.controlMethod=="fixed rocker"){
			if(this._TouchID!=null&&padPoint._TouchID==null){
				padPoint._TouchID=this._TouchID;
				Alias.TouchIdUsed[this._TouchID]=padPoint;
				pad.x=isNaN(Parameters.dPadSettings.x)?eval(Parameters.dPadSettings.x):Parameters.dPadSettings.x;
				pad.y=isNaN(Parameters.dPadSettings.y)?eval(Parameters.dPadSettings.y):Parameters.dPadSettings.y;
				this._TouchID=null;
				padPoint.update();
			} else if(Alias.MouseUsed==this){
				Alias.MouseUsed=padPoint;
				pad.x=isNaN(Parameters.dPadSettings.x)?eval(Parameters.dPadSettings.x):Parameters.dPadSettings.x;
				pad.y=isNaN(Parameters.dPadSettings.y)?eval(Parameters.dPadSettings.y):Parameters.dPadSettings.y;
				padPoint.update();
			}
		} else if(Alias.globalShowStates.controlMethod=="fixed button"){
			if(this._TouchID!=null&&button._TouchID==null){
				button._TouchID=this._TouchID;
				Alias.TouchIdUsed[this._TouchID]=padPoint;
				this._TouchID=null;
				button.update();
			} else if(Alias.MouseUsed==this){
				Alias.MouseUsed=button;
				button.update();
			}
		}else if(Alias.globalShowStates.controlMethod=="touch input"){
			SceneManager._scene.setControlMethod("touch input");
		}
	};

	
	//=============================================================================
	// Sprite_KeyButton
	//=============================================================================
	// Sprite for the buttons that simulate a key input (besides arrow keys).
	// Ex. "ok", "cancel", "pageup", "pagedown"
	//=============================================================================


	function Sprite_KeyButton() {
		this.initialize.apply(this, arguments);
	}

	Sprite_KeyButton.prototype = Object.create(Sprite_VirtualButton.prototype);
	Sprite_KeyButton.prototype.constructor = Sprite_KeyButton;

	Sprite_KeyButton.prototype.initialize = function (x, y, image, hotImage, soundEffect, inputTrigger, customCode, vibratePattern) {
		var inputMethod = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
		var commonEvent = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
		Sprite_VirtualButton.prototype.initialize.call(this, x, y, image, soundEffect, vibratePattern, hotImage);

		if (inputTrigger) {
			this._inputTrigger = inputTrigger;
		}

		if (customCode) {
			this._customCode = customCode;
			this._customFunction = new Function(customCode).bind(SceneManager._scene);
		}

		this._commonEvent = commonEvent;
		this._inputMethod = inputMethod;
		this._point = null;
	};


	Sprite_KeyButton.prototype.updateTouchInput = function () {

		if (this.isTouchTriggered()) {
			var point = this._point;

			if (!!point && this.containsPoint(point)) {
				if (this._soundEffect) {
					AudioManager.playSe(this._soundEffect);
				}

				if (this._vibratePattern) {
					window.navigator.vibrate(this._vibratePattern);
				}

				if (this._customFunction) {
					this._customFunction();
				}

				if (this._commonEvent && $gameTemp) {
					$gameTemp.reserveCommonEvent(this._commonEvent);
				}

				if (this._inputTrigger) {
					Input._currentState[this._inputTrigger] = true;
				}
			} else {
				Input._currentState[this._inputTrigger] = false;
			}
		} else {
			Input._currentState[this._inputTrigger] = false;
		}
	}; //=============================================================================
	// Sprite_ControlButton
	//=============================================================================
	// Sprite for the button that activates / deactivates all other buttons.
	//=============================================================================


	function Sprite_ControlButton() {
		this.initialize.apply(this, arguments);
	}

	Sprite_ControlButton.prototype = Object.create(Sprite_VirtualButton.prototype);
	Sprite_ControlButton.prototype.constructor = Sprite_ControlButton;

	Sprite_ControlButton.prototype.initialize = function (x, y, image, soundEffect) {
		Sprite_VirtualButton.prototype.initialize.call(this, x, y, image, soundEffect);
		this._buttonsHidden = !(Alias.globalShowStates.dPadSettings &&
			Alias.globalShowStates.controlButtonSettings &&
			Object.keys(Alias.globalShowStates.keyButtonSettings).some(function (a) {
				return Alias.globalShowStates.keyButtonSettings[a];
			}));
		this.inputMethod = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		this._moveDistance = 0;
	};

	Sprite_ControlButton.prototype.updateTouchInput = function () {
		var point = this._point;
		var moveDistance = 0;
		if (!!point) {
			this._lastx = this.x;
			this._lasty = this.y;
			this.x = (point.x - this.width / 2) < 0 ? 0 : (((point.x - this.width / 2) > Graphics.width - this.width) ? Graphics.width - this.width : point.x - this.width / 2);
			this.y = (point.y - this.height / 2) < 0 ? 0 : (((point.y - this.height / 2) > Graphics.height - this.height) ? Graphics.height - this.height : point.y - this.height / 2);
		}
		if (this._trigger) {
			this._dstx = this.x;
			this._dsty = this.y;
		}
		if (this._released) {
			moveDistance = this.absDistance(new Point(this._dstx, this._dsty), new Point(this.x, this.y));
			Alias.globalShowStates.controlButtonX = this.x;
			Alias.globalShowStates.controlButtonY = this.y;
			if (moveDistance > 40) {
				return;
			}
		}
		if (this._released) {
			if (this._soundEffect) {
				AudioManager.playSe(this._soundEffect);
			}
			SceneManager._scene.hideVirtualButtonsInstant.call(SceneManager._scene);
			this.changeControlMethod();
		}

	};

	Sprite_ControlButton.prototype.changeControlMethod = function(){
		var method=['fixed button','fixed rocker','dynamic rocker','touch input'];
		var index=method.indexOf(Alias.globalShowStates.controlMethod);
		if(index==-1) index=3;
		index=(index+1)%method.length;
		SceneManager._scene.setControlMethod.call(SceneManager._scene,method[index]);
	};

	//=============================================================================
	// Scene_Base
	//=============================================================================
	// Methods to create the buttons in any scene.
	//=============================================================================


	Alias.Scene_Boot_create = Scene_Boot.prototype.create;

	Scene_Boot.prototype.create = function () {
		Alias.Scene_Boot_create.call(this);
		var params = null;
		Alias.globalShowStates = {};
		Alias.TouchIdUsed=[];
		Alias.MouseUsed=null;
		Alias.globalShowStates.controlMethod = "touch input";// fixed rocker , dynamic rocker , touch input , fixed button
		Alias.globalShowStates.dPadSettings = true;
		Alias.globalShowStates.keyButtonSettings = {};
		params = Parameters.keyButtonSettings;
		for (var i = 0; i < params.length; i++) {
			Alias.globalShowStates.keyButtonSettings[params[i].name.toLowerCase()] = true;
		}
		Alias.globalShowStates.controlButtonSettings = true;
		Alias.globalShowStates.controlButtonX = Parameters.controlButtonSettings.x;
		Alias.globalShowStates.controlButtonY = Parameters.controlButtonSettings.y;

		window.VituralButtons=Alias.globalShowStates;

	};

	Alias.Scene_Base_start = Scene_Base.prototype.start;

	Scene_Base.prototype.start = function () {
		Alias.Scene_Base_start.call(this);
		if(this instanceof Scene_Boot){return ;}
		TouchInput.clear();
		Input.clear();
		Alias.MouseUsed=null;
		Alias.TouchIdUsed=[];
		this.createDirPad();
		this.createKeyButtons();
		this.createControlButton();
		this.hideVirtualButtonsInstant();
		this.setControlMethod(Alias.globalShowStates.controlMethod);
	};

	Scene_Base.prototype.createDirPad = function () {
		var params = Parameters.dPadSettings;

		if (params) {
			//if (params.activeScenes.length > 0 && params.activeScenes.contains(this.constructor)) {
			if (this instanceof Scene_Base) {
				var x = params.x;
				var y = params.y;
				var image = params.rockerImage || "";
				var hotImage="";
				var soundEffect = params.soundEffect;
				var pressedpointimage = params.pressedpointimage || "";
				var buttonImage = params.padImage||"";
				this._directionalPad = new Sprite_DirectionalPad(x, y, image, hotImage, soundEffect);
				this.addChild(this._directionalPad);
				this._directionalPadButton = new  Sprite_DirectionalPad(x,y,buttonImage,hotImage,soundEffect);
				this.addChild(this._directionalPadButton);
				this._directionalPadPoint = new Sprite_DirectionalPadPoint(pressedpointimage);
				this.addChild(this._directionalPadPoint);
				this._directionalPadDynamic = new Sprite_DirectionalPadDynamic(params["Rectangle X"],params["Rectangle Y"],params["Dynamic rocker back img"]);
				this.addChild(this._directionalPadDynamic);

			}
		}
	};

	Scene_Base.prototype.createKeyButtons = function () {
		var params = Parameters.keyButtonSettings;

		if (params) {
			if (params.length > 0) {
				this._keyButtons = {};
				for (var i = 0; i < params.length; i++) {
					//if (params[i].activeScenes.length > 0 && params[i].activeScenes.contains(this.constructor)) {
					if (this instanceof Scene_Base) {
						var a = params[i];
						this._keyButtons[a.name.toLowerCase()] = new Sprite_KeyButton(a.x, a.y, a.image, a.hotImage, a.soundEffect, a.inputTrigger.toLowerCase(), a.customCode, a.vibratePattern, a.inputMethod, a.commonEvent);
						this._keyButtons[a.name.toLowerCase()].name = a.name.toLowerCase();
						this.addChild(this._keyButtons[a.name.toLowerCase()]);
					}
				}
			}
		}
	};

	Scene_Base.prototype.createControlButton = function () {
		var params = Parameters.controlButtonSettings;

		if (params) {
			//if (params.activeScenes.length > 0 && params.activeScenes.contains(this.constructor)) {
			if (this instanceof Scene_Base) {
				var x = Alias.globalShowStates.controlButtonX;
				var y = Alias.globalShowStates.controlButtonY;
				var image = params.image || "";
				var soundEffect = params.soundEffect;
				this._controlButton = new Sprite_ControlButton(x, y, image, soundEffect, params.inputMethod);
				this.addChild(this._controlButton);
				this._controlButton._keyButtons = this._keyButtons;
				this._controlButton._directionalPad = this._directionalPad;
			}
		}
	};

	Scene_Base.prototype.hideVirtualButtons = function () {
		var _this3 = this;

		if (this._directionalPad) {
			this._directionalPad.hide();
			this._directionalPadPoint.hide();
			this._directionalPadDynamic.hide();
			this._directionalPadButton.hide();
		}

		if (this._keyButtons) {
			Object.keys(this._keyButtons).forEach(function (a) {
				return _this3._keyButtons[a].hide();
			});
		}

		if (this._controlButton) {
			this._controlButton.hide();
		}
	};

	Scene_Base.prototype.hideVirtualButtonsInstant = function () {
		var _this3 = this;

		if (this._directionalPad) {
			this._directionalPad.hideInstant();
			this._directionalPadPoint.hideInstant();
			this._directionalPadDynamic.hideInstant();
			this._directionalPadButton.hideInstant();
		}

		if (this._keyButtons) {
			Object.keys(this._keyButtons).forEach(function (a) {
				return _this3._keyButtons[a].hideInstant();
			});
		}

		if (this._controlButton) {
			this._controlButton.hideInstant();
		}
	};

	Alias.Scene_Base_terminate = Scene_Base.prototype.terminate;

	Scene_Base.prototype.terminate = function () {
		var _this5 = this;

		Alias.Scene_Base_terminate.call(this);

		if (this._directionalPad) {
			this.removeChild(this._directionalPad);
			this.removeChild(this._directionalPadPoint);
			this.removeChild(this._directionalPadDynamic);
			this.removeChild(this._directionalPadButton);
		}

		if (this._keyButtons) {
			Object.keys(this._keyButtons).forEach(function (a) {
				return _this5.removeChild(_this5._keyButtons[a]);
			});
		}

		if (this._controlButton) {
			this.removeChild(this._controlButton);
		}
	}; 
	
	Scene_Base.prototype.setControlMethod = function(method){
		this.hideVirtualButtonsInstant();
		switch(method){
			case "touch input":
				if(this._controlButton) this._controlButton.show();
				break;
			case "fixed rocker": case "dynamic rocker":
				if(this._controlButton && Alias.globalShowStates.controlButtonSettings) this._controlButton.show();
				if(this._directionalPadDynamic && Alias.globalShowStates.dPadSettings) this._directionalPadDynamic.show();
				if(this._directionalPadPoint && Alias.globalShowStates.dPadSettings) this._directionalPadPoint.show();
				if(this._directionalPad && Alias.globalShowStates.dPadSettings){
					this._directionalPad.show();
					this._directionalPad.x=isNaN(Parameters.dPadSettings.x)?eval(Parameters.dPadSettings.x):Parameters.dPadSettings.x;
					this._directionalPad.y=isNaN(Parameters.dPadSettings.y)?eval(Parameters.dPadSettings.y):Parameters.dPadSettings.y;
				}
				Object.keys(this._keyButtons).forEach(function(key){
					if(Alias.globalShowStates.keyButtonSettings[key]) SceneManager._scene._keyButtons[key].show();
				});
				break;
			case "fixed button":
				if(this._controlButton && Alias.globalShowStates.controlButtonSettings) this._controlButton.show();
				//if(this._directionalPadDynamic && Alias.globalShowStates.dPadSettings) this._directionalPadDynamic.show();
				//if(this._directionalPadPoint && Alias.globalShowStates.dPadSettings) this._directionalPadPoint.show();
				if(this._directionalPadButton && Alias.globalShowStates.dPadSettings) this._directionalPadButton.show();
				Object.keys(this._keyButtons).forEach(function(key){
					if(Alias.globalShowStates.keyButtonSettings[key]) SceneManager._scene._keyButtons[key].show();
				});
				break;
			default:
				if(this._controlButton) this._controlButton.show();
		}
		Alias.globalShowStates.controlMethod=method;
	};

	//=============================================================================
	// Scene_Map
	//=============================================================================
	// If map movement is disabled from the parameters, return.
	// If an active button is pressed, don't do the usual map movement.
	//=============================================================================


	Alias.Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;

	Scene_Map.prototype.processMapTouch = function () {
		var point=new Point(TouchInput.x,TouchInput.y);
		if(Alias.globalShowStates.controlMethod=="touch input"&&
		!SceneManager._scene._controlButton.containsPoint(point)) 
		Alias.Scene_Map_processMapTouch.call(this);
	};

	Alias.Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
	Scene_Map.prototype.isMenuCalled = function () {
		if (Alias.globalShowStates.controlMethod=="touch input") {
			return Alias.Scene_Map_isMenuCalled.call(this);
		} else {
			return Input.isTriggered('menu');
		}
	};

	//=============================================================================
	// Window_Selectable
	//=============================================================================
	// Disable Touch Input on selectable windows if configured in the parameters.
	//=============================================================================


	Alias.Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;

	Window_Selectable.prototype.processTouch = function () {
		var point=new Point(TouchInput.x,TouchInput.y);
		if(SceneManager._scene._controlButton&&
			SceneManager._scene._controlButton.active&&
			(Alias.globalShowStates.controlMethod!="touch input"||
			SceneManager._scene._controlButton.containsPoint(point))) return;
			
		Alias.Window_Selectable_processTouch.call(this);
	}; 
	//=============================================================================
	// Window_Message
	//=============================================================================
	// Control UI visibility when the dialogue window is activated.
	//=============================================================================


	if (Parameters.hideButtonsDuringDialogue) {
		Alias.Window_Message_startMessage = Window_Message.prototype.startMessage;

		Window_Message.prototype.startMessage = function () {
			SceneManager._scene.hideVirtualButtons();
			if(SceneManager._scene._keyButtons["debug"]){//&&Alias.globalShowStates.controlMethod!='touch input'){
				SceneManager._scene._keyButtons["debug"].showInstant();
			}
			ALOE.clearDpadInput();
			Alias.Window_Message_startMessage.call(this);
		};

		Alias.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;

		Window_Message.prototype.terminateMessage = function () {
			Alias.Window_Message_terminateMessage.call(this);
			SceneManager._scene.setControlMethod(Alias.globalShowStates.controlMethod);
		};
	} 

	if (Parameters.enableDPadDebugWindow) {
		//=============================================================================
		// Window_TouchInputTest
		//=============================================================================
		// The window to test what inputs are currently pressed on the D-Pad
		//=============================================================================
		var Window_TouchInputTest = function Window_TouchInputTest() {
			this.initialize.apply(this, arguments);
		};

		Window_TouchInputTest.prototype = Object.create(Window_Base.prototype);
		Window_TouchInputTest.prototype.constructor = Window_TouchInputTest;

		Window_TouchInputTest.prototype.initialize = function () {
			Window_Base.prototype.initialize.call(this, Graphics.width - 300, 0, 300, 200);
			this._lastState = {
				up: false,
				right: false,
				down: false,
				left: false
			};
			this.refresh();
		};

		Window_TouchInputTest.prototype.update = function () {
			Window_Base.prototype.update.call(this);

			if (this.stateHasChanged()) {
				this.refresh();
			}
		};

		Window_TouchInputTest.prototype.refresh = function () {
			this.contents.clear();
			this.drawText("Up: ".concat(Input._currentState.up), 6, 0);
			this.drawText("Right: ".concat(Input._currentState.right), 6, this.lineHeight());
			this.drawText("Down: ".concat(Input._currentState.down), 6, this.lineHeight() * 2);
			this.drawText("Left: ".concat(Input._currentState.left), 6, this.lineHeight() * 3);
		};

		Window_TouchInputTest.prototype.stateHasChanged = function () {
			if (this._lastState.up !== Input._currentState.up) {
				this._lastState.up = Input._currentState.up;
				return true;
			}

			if (this._lastState.right !== Input._currentState.right) {
				this._lastState.right = Input._currentState.right;
				return true;
			}

			if (this._lastState.down !== Input._currentState.down) {
				this._lastState.down = Input._currentState.down;
				return true;
			}

			if (this._lastState.left !== Input._currentState.left) {
				this._lastState.left = Input._currentState.left;
				return true;
			}

			return false;
		};

		var Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;

		Scene_Map.prototype.createMapNameWindow = function () {
			this._touchInputTestWindow = new Window_TouchInputTest();
			this.addChild(this._touchInputTestWindow);
			Scene_Map_createMapNameWindow.call(this);
		};
	} // end if Parameters.enableDPadDebugWindow
	//=============================================================================
	// Game_Player
	//=============================================================================
	// Help solve bug with stuck movement by clearing input on map transfer.
	//=============================================================================


	var Game_Player_performTransfer = Game_Player.prototype.performTransfer;

	Game_Player.prototype.performTransfer = function () {
		if (this.isTransferring()) {
			Game_Player_performTransfer.call(this);
			ALOE.clearDpadInput();
		}
	};

	ALOE.clearDpadInput = function () {
		delete Input._currentState.left;
		delete Input._currentState.right;
		delete Input._currentState.up;
		delete Input._currentState.down;
	};
	 //==============================================================================
	// Array.prototype.includes
	// Array.prototype.find
	//==============================================================================
	// Polyfill for old versions of MV (1.5 and earlier)
	//==============================================================================
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes


	if (!Array.prototype.includes) {
		Object.defineProperty(Array.prototype, 'includes', {
			value: function value(valueToFind, fromIndex) {
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				} // 1. Let O be ? ToObject(this value).


				var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

				var len = o.length >>> 0; // 3. If len is 0, return false.

				if (len === 0) {
					return false;
				} // 4. Let n be ? ToInteger(fromIndex).
				//    (If fromIndex is undefined, this step produces the value 0.)


				var n = fromIndex | 0; // 5. If n ≥ 0, then
				//  a. Let k be n.
				// 6. Else n < 0,
				//  a. Let k be len + n.
				//  b. If k < 0, let k be 0.

				var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

				function sameValueZero(x, y) {
					return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
				} // 7. Repeat, while k < len


				while (k < len) {
					// a. Let elementK be the result of ? Get(O, ! ToString(k)).
					// b. If SameValueZero(valueToFind, elementK) is true, return true.
					if (sameValueZero(o[k], valueToFind)) {
						return true;
					} // c. Increase k by 1. 


					k++;
				} // 8. Return false


				return false;
			}
		});
	} // https://tc39.github.io/ecma262/#sec-array.prototype.find


	if (!Array.prototype.find) {
		Object.defineProperty(Array.prototype, 'find', {
			value: function value(predicate) {
				// 1. Let O be ? ToObject(this value).
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

				var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

				if (typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				} // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


				var thisArg = arguments[1]; // 5. Let k be 0.

				var k = 0; // 6. Repeat, while k < len

				while (k < len) {
					// a. Let Pk be ! ToString(k).
					// b. Let kValue be ? Get(O, Pk).
					// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
					// d. If testResult is true, return kValue.
					var kValue = o[k];

					if (predicate.call(thisArg, kValue, k, o)) {
						return kValue;
					} // e. Increase k by 1.


					k++;
				} // 7. Return undefined.


				return undefined;
			},
			configurable: true,
			writable: true
		});
	} 
	//Rewrite TouchInput

	Alias.TouchInput_update = TouchInput.update;
	TouchInput.update = function () {
		Alias.TouchInput_update.call(this);
		this._event = this._events._event;
		//this._events._event = null;
	};

	Alias.TouchInput_clear = TouchInput.clear;
	TouchInput.clear = function () {
		Alias.TouchInput_clear.call(this);
		this._events._event = null;
	};

	Alias.TouchInput_onMouseDown = TouchInput._onMouseDown;
	TouchInput._onMouseDown = function (event) {
		this._events._event = event;
		Alias.TouchInput_onMouseDown.call(this, event);
	};

	Alias.TouchInput_onMouseMove = TouchInput._onMouseMove;
	TouchInput._onMouseMove = function (event) {
		this._events._event = event;
		Alias.TouchInput_onMouseMove.call(this, event);
	};

	Alias.TouchInput_onMouseUp = TouchInput._onMouseUp;
	TouchInput._onMouseUp = function (event) {
		this._events._event = event;
		Alias.TouchInput_onMouseUp.call(this, event);
	};

	Alias.TouchInput_onWheel = TouchInput._onWheel;
	TouchInput._onWheel = function (event) {
		this._events._event = event;
		Alias.TouchInput_onWheel.call(this, event);
	};

	Alias.TouchInput_onTouchStart = TouchInput._onTouchStart;
	TouchInput._onTouchStart = function (event) {
		this._events._event = event;
		Alias.TouchInput_onTouchStart.call(this, event);
		this._screenPressed = event.targetTouches.length !== 0;
	};

	Alias.TouchInput_onTouchMove = TouchInput._onTouchMove;
	TouchInput._onTouchMove = function (event) {
		this._events._event = event;
		Alias.TouchInput_onTouchMove.call(this, event);
		this._screenPressed = event.targetTouches.length !== 0;
	};

	Alias.TouchInput_onTouchEnd = TouchInput._onTouchEnd;
	TouchInput._onTouchEnd = function (event) {
		this._events._event = event;
		Alias.TouchInput_onTouchEnd.call(this, event);
		this._screenPressed = event.targetTouches.length !== 0;
	};

	Alias.TouchInput_onTouchCancel = TouchInput._onTouchCancel;
	TouchInput._onTouchCancel = function (event) {
		this._events._event = event;
		Alias.TouchInput_onTouchCancel.call(this, event);
		this._screenPressed = event.targetTouches.length !== 0;
	};

	Alias.TouchInput_onPointerDown = TouchInput._onPointerDown;
	TouchInput._onPointerDown = function (event) {
		this._events._event = event;
		Alias.TouchInput_onPointerDown.call(this, event);
	};

	Alias.DataManager_makeSaveContents = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function () {
		var contents = Alias.DataManager_makeSaveContents.call(this);
		contents.virtualButtonSates = Alias.globalShowStates;
		return contents;
	};

	Alias.DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function (contents) {
		Alias.DataManager_extractSaveContents.call(this, contents);
		Alias.globalShowStates = contents.virtualButtonSates;
		if (!Alias.globalShowStates) {
			var params = null;
			Alias.globalShowStates = {};

			if (Parameters.dPadSettings.activeScenes) {
				Alias.globalShowStates.dPadSettings = true;
			}

			if (Parameters.keyButtonSettings) {
				Alias.globalShowStates.keyButtonSettings = {};
				params = Parameters.keyButtonSettings;
				for (var i = 0; i < params.length; i++) {
					Alias.globalShowStates.keyButtonSettings[params[i].name.toLowerCase()] = true;
				}
			}

			if (Parameters.controlButtonSettings.activeScenes) {
				Alias.globalShowStates.controlButtonSettings = true;
				Alias.globalShowStates.controlButtonX = Parameters.controlButtonSettings.x;
				Alias.globalShowStates.controlButtonY = Parameters.controlButtonSettings.y;
			}

			Alias.globalShowStates.controlMethod='touch input';
		}

		window.VituralButtons=Alias.globalShowStates;
	};

	Object.defineProperties(Game_CharacterBase.prototype, {
		'_moveSpeed': {
			get: function () {
				if (SceneManager._scene && SceneManager._scene._directionalPadPoint && SceneManager._scene._directionalPadPoint.active) {
					var point1 = SceneManager._scene._directionalPadPoint._point;
					var center = SceneManager._scene._directionalPad.GetCenterPoint();
					if (!(center && point1)) {
						return this._ALOE_maxMoveSpeed;
					}
					var range = SceneManager._scene._directionalPad.absDistance(point1, center);
					var width = Math.max(SceneManager._scene._directionalPad.width, SceneManager._scene._directionalPad.height);
					if (range > width / 2 || range < width / 6) {
						return this._ALOE_maxMoveSpeed;
					} else {
						return (range - width / 6) / (width / 3) * this._ALOE_maxMoveSpeed;
					}
				} else {
					return this._ALOE_maxMoveSpeed;
				}
			},
			set: function (value) {
				this._ALOE_maxMoveSpeed = value;
				return value;
			},
			configurable: true
		}
	});
})();