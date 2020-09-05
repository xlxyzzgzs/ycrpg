//###############################################################################
// Name:        CloudManager
// Description: A simple cloud based game load and save system for RPG Maker MV
// Version:     0.9.3 (per user savegames)
// Author:      Frank A. Grenzel
// License:     CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)
//###############################################################################
//
// ### Longer description ###
// This file is part of the Cloud Manager, a simple cloud (server) based load and
// save system for RPG Maker MV. With the Cloud Manager you can store your save-
// games on and load it from your server. It doesn't matter where you play the
// game. You can start it on your Windows desktop, quit it and later continue it
// on a browser anywhere - without copy savegames manually.
// This file is a plugin for RPG Maker MV and part of the Cloud Manager.
// For simplification the Cloud Manager is using SQLite database for storage 
// instead of MySQL. SQLite needs no special database server setup and uses just
// a simple file (you can easily saved for backup).
//
// ### How to install ###
// To use the Cloud Manager on your game you need a server, with some requirements:
// * >=PHP 5.6 (maybe other versions would work but not tested)
// * SQLite3 database driver
// * PHP PDO support for SQLite (pdo_sqlite)
//
// The Cloud Manager comes with 3 files:
// * db_create.php    - a simple script to initialize the database
// * cloudmanager.php - the server script
// * CloudManager.js  - the RPG Maker plugin
//
// 1. Copy db_create.php and cloudmanager.php on your server.
// 2. Once run db_create.php. This should create the database (rmmv.sqlite) on
//    your server with 3 tables in it.
// 3. Copy CloudManager.js to your js/plugin folder and add the plugin on the
//    PluginManager. Then setup the plugin properties.
//    IMPORTANT: As long as the CloudManager plugin is active your games needs a
//               semi-permanent connection to your server to run!
//               Semi-permanent means on start, continue, new game, save game
//               and back to title screen.
//    HINT: If you have a server connection as needed but the Cloud Manager won't
//          work, check the permissions of your scripts and database file.
//
// ### How it works ###
// If the plugin is activated, your game don't write or read savegames from you
// local drive or the browser local storage anymore. Also there are no save/load
// slots anymore. Your game will have just one savegame on your server. No more,
// no less. But with access to the database you have access to all previous made
// savegames (stored on your server). 
//
// Title Screen
// On start the plugin checks if a savegame for this game is on the server.
// "Continue" is enabled, if a savegame was found and the game version is recent
// enough. If you select "Continue" the latest savegame will be loaded from the
// server and the game starts with it.
// If you select "New Game" and preventRestart is disabled a new game will start
// as you know. If preventRestart is enabled the plugin checks for a savegame on
// the server. If there is no savegame you can start a new game. If a savegame was
// found but your game version is obsolete you fall back to the title screen (well,
// you can't play the game until you have a newer game version). If a savagame was
// found and your game version is up-to-date the latest savegame will be loaded from
// the server and the game starts with it.
//
// InGame Command Menu
// If you select "Save" the plugin will send your current game data to the server,
// hopefully saves it on the database. There are no other options, just save and
// gone.
// If you select "End" and "To Title" and saveOnEnd is active your current game
// data will be saved on the server before the title menu is shown. If saveOnEnd
// is disabled you will see the title menu without saveing the last state on server.
//
// Server
// On the server side there is just one script to handle all plugin requests. It
// reads the game version of the last relevant savegame and compares it with your game
// version. It reads the last relevant savegame from the database and sends the json
// game data back to the game and it writes the transmitted json game data into the
// database (with game name and version, username and timestamp).

// ### Plugin Parameters ###
// * gameName: This should be unique for all your games, because it makes sure you get
//   the saved data of the right game from your server (so you can handle several
//   different games on your server).
// * gameVersion: The plugin verify the version of a game is up-to-date to handle the
//   last game saved on the server.
// * url: Right, this is where your php scripts are.
// * saveOnEnd: If active your game is saved on every games end on the server. Well,
//   of course you can save it at all times but with this option a player can't drop
//   the last events and try it again.
// * preventRestart: Usually you can start a new game at all times. This would overwrite
//   the could saved data and reset the whole game. With this option active you can't
//   start a new game if a saved game is on the server.
// * sessionManagement: If you want to use the session management set it to 1.
// * perUserGame: If set to 1 the game will besaved for every user seperate.
//   sessionManagement must set to 1 too.
// * logLevel: Well, just an option which messages are shown on the console.
//
// ### Session Management ### (BETA!)
// Okay, I have added some simple session management.
// With session management only one player (means game instance) can be the "active
// player". All other players are in "passive mode", can't save the game.
//
// How does it work?
//
// On the server there is a session table. Every time a player wants to continue a
// saved or start a new game the game ask the server if there is an active player
// already in the game. If so, the games runs in "passive mode". If no active player
// found, the game runs in "active mode". Doesn't matter which mode, every running
// game has an entry on the session table (so you can see, how many players are on the
// game this time).
// In "passive mode", all commands in command window are hidden but options and end
// game. So in "passive mode" you can't save the game (auto save on game end is disabled
// in passive mode too).
//
// To distinguish the game instances the server sends a GUID to the game on first connect.
// This GUID is unique for every session (expires if the whole game will be quit).
//
// Important: An active session will be changed to passive if the player comes back to
// the title screen. But if the game is closed without come back to the title screen, 
// the session is marked as active on the database furthermore and nobody can be active
// anymore.
//
// ### Terms of Use ###
// The Cloud Manager is distributed as is under the creative commons license CC BY 3.0
// (Attribution 3.0 Unported) for free.
// You are free to share, copy, redistribute or edit it for any purpose, even commercially
// under the following terms: You must give appropriate credit, provide a link to the
// license, and indicate if changes were made. You may do so in any reasonable manner,
// but not in any way that suggests the licensor endorses you or your use.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// ### Contact ###
// Feel free to contact me. You can find me as Purzelkater on http://forums.rpgmakerweb.com

/*:
 * @plugindesc Save and load games into/from the cloud
 * @author Purzelkater

 * @param gameName
 * @desc The name of the game (should be unique)
 * @default My Game
 
 * @param gameVersion
 * @desc The version of the game
 * @default 1.0
 
 * @param url
 * @desc URL to server (the php script bust be there)
 * @default http://www.my-server.com
 
 * @param saveOnEnd
 * @desc Save game on game quit?
 * @default 1
 
 * @param preventRestart
 * @desc Prevent new game if saved game is found
 * @default 1
 
 * @param sessionManagement
 * @desc Use session management? (0=all can save, 1=only active player can save)
 * @default 0 
 
 * @param perUserGame
 * @desc Save the game for every user separate? (0=no, 1=yes)
 * @default 0
 
 * @param loginActorId
 * @desc Actor Id, used for the login screen face picture
 * @default 1
 
 * @param logLevel
 * @desc 0=Disabled, 1=Errors, 2=Errors/Warnings, 3=All
 * @default 0
 
*/
function cloudManager() {
  // static object for ingame use
};

var Imported = Imported || {};
Imported.CloudManager = true;

(function() {
	// Extract parameters from plugin settings (RPG Maker plugin manager)
	var _parameters        = PluginManager.parameters('CloudManager');
	var _gameName          = _parameters['gameName']                   || "My Game";
	var _gameVersion       = parseFloat(_parameters['gameVersion']     || 1.0);
	var _url               = _parameters['url']                        || "http://www.my-server.com";
	var _saveOnEnd         = parseInt(_parameters['saveOnEnd']         || 1);
	var _preventRestart    = parseInt(_parameters['preventRestart']    || 1);
	var _sessionManagement = parseInt(_parameters['sessionManagement'] || 0);
	var _logLevel          = parseInt(_parameters['logLevel']          || 0);
	var _perUserGame       = parseInt(_parameters['perUserGame']       || 0);
	var _loginActorId      = parseInt(_parameters['loginActorId']      || 1);
	
	var _userName          = "CloudManager";     // used with perUserGame
	var _password          = "mySecretPassword"; // used with perUserGame
    var _saveName=null;
	var _userAction=null;
	
	var _checkedDB=false;
	
	Graphics._requestFullScreen();
	window.onbeforeunload = function (e) {
	  e = e || window.event;

	  // 兼容IE8和Firefox 4之前的版本
	  if (e) {
		e.returnValue = '关闭提示';
	  }

	  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
	  return '关闭提示';
	};
	
	// 0: undefined
	// 1: game started (on title screen)
	// 2: passive (can't save)
	// 3: active (can save)
	function Debug(level, text) {
		if (_logLevel>=level) {
			switch(level) {
				case 1:
					console.error("[CM] "+text);
					break;
				case 2:
					console.warn("[CM] "+text);
					break;
				case 3:
					console.log("[CM] "+text);
					break;
			};
		
		};
	};
	function getQueryVariable(variable)
	{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	}
	_gameName=getQueryVariable("GameName");
	_gameVersion=getQueryVariable("GameVersion");
	
	//获取用户信息
	GetUserInfo=function (){
		if (!(_gameName&&_gameVersion)){
			alert("Please Login Firstly");
			location.href="/login.html";
			return;
		}
		var xhttp = new XMLHttpRequest();
		var data=
			"Action="+encodeURIComponent("GetUserInfo")+
			"&GameName="+(_gameName)+
			"&GameVersion="+(_gameVersion);
		xhttp.open('POST', _url+"/login.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		result=JSON.parse(xhttp.responseText);
		switch(result["code"]){
			case "Logined":
				var userdata=JSON.parse(result["content"]);
				_userName=userdata["UserName"];
				_password=userdata["PassWord"];
				_saveName=userdata["SaveName"];
				_userAction=userdata["Choice"];
				if(!(_gameName&&_gameVersion&&_userName&&_password&&_saveName&&_userAction)){
					alert("Some Error Happened!Please Login Firstly");
					location.href="/login.html";
				}
				break;
			case "NotLogin":
				alert("Please Login First!");
				location.href="/login.html";
				break;
			case "runJs":
				eval(result["content"]);
				break;
			default:
				alert("Some Error May Happen!");
				location.href="/login.html";
		}
		
	}
	GetUserInfo();
	/*** 覆写YEP_X_AutoSave用*/
	DataManager.saveGameWithoutRescue = function() {
		
		if (!_checkedDB){
			CheckDB(DataManager.makeSaveContents(),_saveName);
			CheckDB(DataManager.makeSaveContents(),"AutoSaved");
			_checkedDB=true;
			return;
		}
		saveGame(DataManager.makeSaveContents(),"AutoSaved")
	};
	Scene_Map.prototype.performAutosave = function()
	{
		$gameSystem.onBeforeSave();
		DataManager.saveGameWithoutRescue();
		if (this._autosaveMsgWindow) this._autosaveMsgWindow.reveal();
	}
	StorageManager.performAutosave = function() {
		$gameTemp._autosaveNewGame=false;
		SceneManager._scene.performAutosave();
	};
	/* 覆写截止*/
	
	saveGame=function(cont,SaveName){
		var json = JsonEx.stringify(cont);
		if (json.length >= 200000) {
			Debug(2,'Save data too big');
		};    
		// Initialize HTTP Request
		var xhttp = new XMLHttpRequest();
		var data = 
			"Action="+encodeURIComponent("SaveGame")+
			"&GameName="+(_gameName)+
			"&GameVersion="+(_gameVersion)+
			"&UserName="+(_userName)+
			"&Password="+(_password)+
			"&SaveName="+(SaveName)+
			"&UserData="+encodeURIComponent(json);
		
		// Send savegame data
		Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
		xhttp.open('POST', _url+"/cloudmanager.php", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		
		var result = xhttp.responseText;
		Debug(3,result);
		return true
	}
	
	loadGame=function(SaveName){
		var xhttp = new XMLHttpRequest();
		var data = 
			"Action="+encodeURIComponent("LoadGame")+
			"&GameName="+(_gameName)+
			"&GameVersion="+(_gameVersion)+
			"&UserName="+(_userName)+
			"&Password="+(_password)+
			"&SaveName="+(SaveName)+
			"&UserData="+(_userAction);

		// Get savegame data
		Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
		xhttp.open('POST', _url+"/cloudmanager.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		return xhttp.responseText;
}
	
	/*******************************************
	  Overwrite "save" on ingame option screen
	*******************************************/
	Scene_Menu.prototype.commandSave = function() {
		saveGame(DataManager.makeSaveContents(),_saveName);
		// Close option window
		SceneManager.pop();		
	};

	/***********************************************
	  Overwrite "end game" on ingame option screen
	***********************************************/
	Scene_GameEnd.prototype.commandToTitle = function() {
		saveGame(DataManager.makeSaveContents(),_saveName);
		window.location.href="./login.html";
	};
	//添加数据库中有没有需要的内容
	CheckDB=function(cont,SaveName){
		var json = JsonEx.stringify(cont);
		if (json.length >= 200000) {
			Debug(2,'Save data too big');
		}; 
		var xhttp = new XMLHttpRequest();
			var data = 
				"Action="+encodeURIComponent("CheckForDB")+
				"&GameName="+(_gameName)+
				"&GameVersion="+(_gameVersion)+
				"&UserName="+(_userName)+
				"&Password="+(_password)+
				"&SaveName="+(SaveName)+
				"&UserData="+(json);

			// Get savegame data
			Debug(3,"Open "+_url+"/cloudmanager.php?"+data);
			xhttp.open('POST', _url+"/cloudmanager.php", false);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send(data);

			var result =xhttp.responseText;
			Debug(3,"Added "+result);
	};
	//开始加载游戏
	StartGame=function(){ 
		switch(_userAction){
			case "newgame":
				DataManager.setupNewGame();
				SceneManager.goto(Scene_Map);
				break;
			case "continue":
				

				var result =JSON.parse(loadGame(_saveName));

				if (result["code"]==="LoadGame"){

					Debug(3,"Loaded "+result);

					// Extract data from savegame
					DataManager.createGameObjects();
					DataManager.extractSaveContents(JsonEx.parse(result["content"]));

					// Move player
					$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
					$gamePlayer.requestMapReload();

					// Initialize map
					SceneManager.goto(Scene_Map);	

					$gameSystem.onAfterLoad();
				}else {
					alert(result["content"]);
					window.location.href="./index.html";
				}
				break;
			case "autosaved":

				var result =JSON.parse(loadGame("AutoSaved"));

				if (result["code"]==="LoadGame"){

					Debug(3,"Loaded "+result);

					// Extract data from savegame
					DataManager.createGameObjects();
					DataManager.extractSaveContents(JsonEx.parse(result["content"]));

					// Move player
					$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
					$gamePlayer.requestMapReload();

					// Initialize map
					SceneManager.goto(Scene_Map);	

					$gameSystem.onAfterLoad();
				}else {
					alert(result["content"]);
					window.location.href="./index.html";
				}
				break;
			default:
				alert(result["content"]);
				window.location.href="./index.html";
		}
	}
	/*重写 Scene_Boot.prototype.create*/
	Scene_Title_create=Scene_Title.prototype.create;
	Scene_Title.prototype.create=function(){};
	Scene_Title_update=Scene_Title.prototype.update;
	Scene_Title.prototype.update=function(){};
	Scene_Title_start=Scene_Title.prototype.start;
	Scene_Title.prototype.start=function(){
		StartGame();
	}
	Scene_Boot_start=Scene_Boot.prototype.start;//跳过title
	Scene_Boot.prototype.start = function() {
		Graphics._requestFullScreen();//游戏全屏
		Scene_Base.prototype.start.call(this);
		SoundManager.preloadImportantSounds();
		if (DataManager.isBattleTest()) {
			DataManager.setupBattleTest();
			SceneManager.goto(Scene_Battle);
		} else if (DataManager.isEventTest()) {
			DataManager.setupEventTest();
			SceneManager.goto(Scene_Map);
		} else {
			this.checkPlayerLocation();
			StartGame();
		}
		this.updateDocumentTitle();
	};
	
	TouchInput_setupEventHandlers=TouchInput._setupEventHandlers; //鼠标滚轮有warning
	TouchInput._setupEventHandlers = function() {
		var isSupportPassive = Utils.isSupportPassiveEvent();
		document.addEventListener('mousedown', this._onMouseDown.bind(this));
		document.addEventListener('mousemove', this._onMouseMove.bind(this));
		document.addEventListener('mouseup', this._onMouseUp.bind(this));
		document.addEventListener('wheel', this._onWheel.bind(this), isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {passive: false} : false);
		document.addEventListener('touchend', this._onTouchEnd.bind(this));
		document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
		document.addEventListener('pointerdown', this._onPointerDown.bind(this));
	};
	var ConfigLoadErrorTimes=0;
	ConfigManager_load=ConfigManager.load; //从云端加游戏设置
	ConfigManager.load = function() {
		var json;
		var config = {};

		var result =JSON.parse(loadGame("ConfigSaved"));
		if (result["code"]==="LoadGame"){
			Debug(3,"Loaded "+result);
			try {
				json = result["content"];
			} catch (e) {
				console.error(e);
			}
			if (json) {
				config = JSON.parse(json);
			}
			this.applyData(config);
		}else {
			if(ConfigLoadErrorTimes<3){
				ConfigLoadErrorTimes=ConfigLoadErrorTimes+1;
				CheckDB(this.makeData(),"ConfigSaved");
				this.load();
			}else{
				alert(result["content"]);
				window.location.href="./index.html";
			}
		}
	};
	
	ConfigManager_save=ConfigManager.save;//保存到云端
	ConfigManager.save = function() {
		saveGame(this.makeData(),"ConfigSaved");
	};

})();