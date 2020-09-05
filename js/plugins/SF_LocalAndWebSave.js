//import { Graphics } from "pixi.js";


//=============================================================================
// Load local And web Savefiles
//  last update: 2019/10/14
//=============================================================================

/*:
 * @plugindesc
 * v0.1 Load local And web Savefiles
 *
 * @author SF
 *
 * @param GameName
 * @desc The name of the game (should be unique)
 * @default My Game
 
 * @param GameVersion
 * @desc The version of the game
 * @default 1
 
 * @param url
 * @desc URL to server (the php script bust be there)
 * @default http://www.my-server.com
 *
 * @param LocalChoiceName
 * @desc Show On Choice Windows as Command
 * @default From Local
 * 
 * @param WebChoiceName
 * @desc Show On Choice Windows as Command
 * @default From Web
 * 
 * @param CancelName
 * @desc Show On Choice Windows as Command
 * @default Cancel
 * 
 * @param LogoutName
 * @desc Show On Choice Windows as Command
 * @default Logout 
 * 
 * @param SaveFileControlName
 * @desc Show On Choice Windows as Command
 * @default SaveControl
 * @help
 * required YEP_SaveCore.js YEP_X_AutoSave.js YEP_Options.js 
 * SF_InputBindControl
 */

 /*
* @param GameNameShow
* @desc Show On Login documents
* @default GameName
* 
* @param GameVersionShow
* @desc Show On Login documents
* @default GameVersion
* 
* @param UserNameShow
* @desc Show On Login documents
* @default UserName
*
* @param PasswordShow
* @desc Show On Login documents
* @default Password
*
* @param UserChioceShow
* @desc Show On Login documents
* @default UserChoice
* 
* @param GameNameShow
* @desc Show On Login documents
* @default GameName
*/

var Imported = Imported ||{};
Imported.SF_LocalAndWebSave=true;

var SF_Plugins=SF_Plugins||{};

(function(){
	var LLWS={};
	SF_Plugins.SF_LocalAndWebSave=LLWS;

	LLWS.UserName=null;
	LLWS.PassWord=null;
	LLWS.UserAction=null;
	LLWS.Params=PluginManager.parameters("SF_LocalAndWebSave");
	LLWS.paramList={};
	LLWS.paramList.GameName=(LLWS.Params.GameName);
	LLWS.paramList.GameVersion=(LLWS.Params.GameVersion);
	LLWS.paramList.LocalName=LLWS.Params.LocalChoiceName;
	LLWS.paramList.WebName=LLWS.Params.WebChoiceName;
	LLWS.paramList.CancelName=LLWS.Params.CancelName;
	LLWS.paramList.LogoutName=LLWS.Params.LogoutName;
	LLWS.paramList.URL=LLWS.Params.url;
	LLWS.paramList.SaveFileControlName=LLWS.Params.SaveFileControlName;
	
	//MayBe ReWrite Function At This
	
	LLWS.NowAction=null;// save , load
	LLWS.FromWhere="local"; //local , web
	LLWS.GlobalInfo=null;
	LLWS.tempStorage={};
	LLWS.StorageNameList=["RPG 异常生物见闻录 Config",
		"RPG 异常生物见闻录 File1",
		"RPG 异常生物见闻录 File2",
		"RPG 异常生物见闻录 File3",
		"RPG 异常生物见闻录 File4",
		"RPG 异常生物见闻录 File5",
		"RPG 异常生物见闻录 File6",
		"RPG 异常生物见闻录 File7",
		"RPG 异常生物见闻录 File8",
		"RPG 异常生物见闻录 File9",
		"RPG 异常生物见闻录 File10",
		"RPG 异常生物见闻录 Global"];

	LLWS.CanLogin=function(){
		return LLWS.UserName&&LLWS.PassWord&&navigator.onLine;
	};

	//LLWS.tempStorage is the newest file
	LLWS.StorageManager_save=StorageManager.save;
	StorageManager.save = function(savefileId, json) {
		if(LLWS.FromWhere== "web" &&LLWS.CanLogin()){
			var key=this.webStorageKey(savefileId);
			//var data=LZString.compressToBase64(json);
			var data=json;
			LLWS.tempStorage[key]=data;
			LLWS.SetItemWeb(key,data);
		} else {
			LLWS.StorageManager_save.call(this,savefileId,json);
		}
	};

	LLWS.StorageManager_load=StorageManager.load;
	StorageManager.load = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key=this.webStorageKey(savefileId);
			return LLWS.tempStorage[key]||"";
		} else {
			return LLWS.StorageManager_load.call(this,savefileId);
		}
	};

	LLWS.StorageManager_exists=StorageManager.exists;
	StorageManager.exists = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key=this.webStorageKey(savefileId);
			return !!LLWS.tempStorage[key];
		} else {
			return  LLWS.StorageManager_exists.call(this,savefileId);
		}
	};

	LLWS.StorageManager_remove=StorageManager.remove;
	StorageManager.remove = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key = this.webStorageKey(savefileId);
			delete LLWS.tempStorage[key];
			LLWS.RemoveItemWeb(key);
		} else {
			LLWS.StorageManager_remove.call(this,savefileId);
		}
	};

	//Back Up only opreation on LLWS.tempStorage 
	LLWS.StorageManager_backup=StorageManager.backup;
	StorageManager.backup = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key = this.webStorageKey(savefileId);
			var data="";
			data=LLWS.tempStorage[key];
			LLWS.tempStorage[key]=data;
            key += "bak";
            LLWS.SetItemWeb(key,data);
		} else {
			LLWS.StorageManager_backup.call(this,savefileId);
		}

	};

	LLWS.StorageManager_backupExists=StorageManager.backupExists;
	StorageManager.backupExists = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key = this.webStorageKey(savefileId) + "bak";
			return !!LLWS.tempStorage[key];
		} else {
			return LLWS.StorageManager_backupExists.call(this,savefileId);
		}
	};

	LLWS.StorageManager_cleanBackup=StorageManager.cleanBackup;
	StorageManager.cleanBackup = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key = this.webStorageKey(savefileId) + "bak";
			delete LLWS.tempStorage[key];
		} else {
			LLWS.StorageManager_cleanBackup.call(this,savefileId);
		}
	};

	LLWS.StorageManager_restoreBackup=StorageManager.restoreBackup;
	StorageManager.restoreBackup = function(savefileId) {
		if(LLWS.FromWhere=="web"&&LLWS.CanLogin()){
			var key = this.webStorageKey(savefileId)+"bak";
			var data="";
			data=LLWS.tempStorage[key];
			key = this.webStorageKey(savefileId);
			LLWS.tempStorage[key]=data;
			delete LLWS.tempStorage[key+"bak"];
		} else {
			LLWS.StorageManager_restoreBackup.call(this,savefileId);
		}
	};

	/*
	LLWS.GetItemWeb=function(key){
		if(LLWS.CanLogin()){		
			var xhttp = new XMLHttpRequest();
			var data = 
				"Action="+encodeURIComponent("GetItem")+
				"&GameName="+encodeURIComponent(LLWS.paramList.GameName)+
				"&GameVersion="+encodeURIComponent(LLWS.paramList.GameVersion)+
				"&UserName="+(LLWS.UserName)+
				"&Password="+(LLWS.PassWord)+
				"&key="+encodeURIComponent(key)+
				"&data=Empty";
	
			xhttp.open('POST', LLWS.paramList.URL, false);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send(data);
			return decodeURIComponent(xhttp.responseText);	
		}else{
			return localStorage.getItem(key);
		}
	};*/

	LLWS.timeId=undefined;
	LLWS.Sync=function(){
		if(LLWS.CanLogin()){
			LLWS.GetAllItemWeb();
			LLWS.timeId=setTimeout(LLWS.Sync,15*60*1000);
		}
	};

	LLWS.GetAllItemWeb=function(){
		if(!LLWS.CanLogin()) return;
		var xhttp = new XMLHttpRequest();
		var data = 
				"Action="+encodeURIComponent("GetAllItems")+
				"&GameName="+encodeURIComponent(LLWS.paramList.GameName)+
				"&GameVersion="+encodeURIComponent(LLWS.paramList.GameVersion)+
				"&UserName="+(LLWS.UserName)+
				"&Password="+(LLWS.PassWord)+
				"&key=Empty"+
				"&data=Empty";
		xhttp.open('POST', LLWS.paramList.URL);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		xhttp.url=LLWS.paramList.URL+"/?GetAllItemWeb";
		window.FileLoadingList.push(xhttp._url);
		xhttp.addEventListener("loadend",LLWS.xhttpResult.bind(xhttp,(function(){
			var result=JsonEx.parse(this.responseText);
			for(var key in result){
				LLWS.tempStorage[key]=decodeURIComponent(result[key]);
			}
			LLWS.StorageNameList.forEach(function(key){
				if(! (key in LLWS.tempStorage)){
					LLWS.tempStorage[key]="";
				}
			});
		}).bind(xhttp),function(){}));
	};

	LLWS.SetItemWeb=function(key,data){
		if(LLWS.CanLogin()){		
			var xhttp = new XMLHttpRequest();
			var ajax_data = 
				"Action="+encodeURIComponent("SetItem")+
				"&GameName="+encodeURIComponent(LLWS.paramList.GameName)+
				"&GameVersion="+encodeURIComponent(LLWS.paramList.GameVersion)+
				"&UserName="+(LLWS.UserName)+
				"&Password="+(LLWS.PassWord)+
				"&key="+encodeURIComponent(key)+
				"&data="+encodeURIComponent(data);
			
			//JSON.parse(data);
	
			xhttp.open('POST', LLWS.paramList.URL);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send(ajax_data);
			xhttp.url=LLWS.paramList.URL+"/?SetItemWeb&Key="+key;
			window.FileLoadingList.push(xhttp._url);
			xhttp.addEventListener("loadend",LLWS.xhttpResult.bind(xhttp,function(){},function(){}));
			
		}else{
			return localStorage.setItem(key,data);
		}
	};

	LLWS.RemoveItemWeb=function(key){
		if(LLWS.CanLogin()){		
			var xhttp = new XMLHttpRequest();
			var data = 
				"Action="+encodeURIComponent("RemoveItem")+
				"&GameName="+encodeURIComponent(LLWS.paramList.GameName)+
				"&GameVersion="+encodeURIComponent(LLWS.paramList.GameVersion)+
				"&UserName="+(LLWS.UserName)+
				"&Password="+(LLWS.PassWord)+
				"&key="+encodeURIComponent(key)+
				"&data=Empty";
	
			xhttp.open('POST', LLWS.paramList.URL);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send(data);
			xhttp.url=LLWS.paramList.URL+"/?RemoveItemWeb&Key="+key;
			window.FileLoadingList.push(xhttp._url);
			xhttp.addEventListener("loadend",LLWS.xhttpResult.bind(xhttp,function(){},function(){}));
		}else{
			localStorage.removeItem(key);
		}
	};

	LLWS.SceneManager_goto=SceneManager.goto;
	SceneManager.goto = function(sceneClass) {
		LLWS.SceneManager_goto.call(this,sceneClass);
		//LLWS.GetAllItemWeb();
	};

	LLWS.xhttpResult=function(onload,onerror){
		if(this.readyState==4&&this.status==200){
			onload();
		}else{
			LLWS.UserName="";
			LLWS.PassWord="";
			onerror();
			if(Graphics._errorPrinter && !Graphics._errorShowed){
				SceneManager.stop();
				Graphics._errorPrinter.innerHTML = Graphics._makeErrorHtml('在线存档出现了一些问题','现已转成本地存档<br />'+
				"请求内容："+this._url+"<br />请求状态：readyState:"+this.readyState+"&nbsp;&nbsp;status:"+this.status);
				var button = document.createElement('button');
				button.innerHTML = '继续';
				button.style.fontSize = '24px';
				button.style.color = '#ffffff';
				button.style.backgroundColor = '#000000';
				button.onmousedown = button.ontouchstart = function (event) {
					Graphics.eraseLoadingError();
					SceneManager.resume();
					event.stopPropagation();
				};
				Graphics._errorPrinter.appendChild(button);
				Graphics._loadingCount = -Infinity;
			}
		}
		var index=window.FileLoadingList.indexOf(this._url);
		if(index>=0){window.FileLoadingList.splice(index,1);}
	};
	//From Yep_X_Autosave.js
	StorageManager.performAutosave = function() {
		if ($gameMap.mapId() <= 0) return;
		if (!$gameSystem.canAutosave()) return;
		SceneManager._scene.performAutosave();
	  };
	  

	Scene_Map.prototype.performAutosave = function() {
		if ($gameMap.mapId() <= 0) return;
		if (!$gameSystem.canAutosave()) return;
		$gameSystem.onBeforeSave();
		DataManager.saveGameWithoutRescue(1);
		if (this._autosaveMsgWindow) this._autosaveMsgWindow.reveal();
	  };

	//Show Auto Save on Scene_File index=0
	LLWS.Window_SavefileList_drawItem=Window_SavefileList.prototype.drawItem;
	Window_SavefileList.prototype.drawItem = function(index) {
		var id = index + 1;
		var valid = DataManager.isThisGameFile(id);
		var rect = this.itemRect(index);
		this.resetTextColor();
		//if (this._mode === 'load') this.changePaintOpacity(valid);
		this.changePaintOpacity(valid);
		var icon = valid ? Yanfly.Param.SaveIconSaved : Yanfly.Param.SaveIconEmpty;
		this.drawIcon(icon, rect.x + 2, rect.y + 2);
		if(id==1){//First is AutoSaved
			this.drawText("AutoSaved",rect.x + Window_Base._iconWidth + 4, rect.y, 180);
		} else {
			this.drawFileId(id-1, rect.x + Window_Base._iconWidth + 4, rect.y);
		}
	};
	Window_SaveAction.prototype.isSaveEnabled = function() {
		if (this._mode !== 'save') return false;
		if(this._currentFile==1)return false;
		return $gameSystem.isSaveEnabled();
	};

	Scene_Menu.prototype.commandSave = function() {
		SceneManager.push(Scene_LLWS_Choice);
		LLWS.NowAction="save";
	};
	
	Scene_Title.prototype.commandContinue = function() {
		SceneManager.push(Scene_LLWS_Choice);
		LLWS.NowAction="load";
	};

	Window_TitleCommand.prototype.isContinueEnabled = function() {
		return true;
	};

	//need Scene_LLWS_Local_Load Scene_LLWS_Local_Save Scene_LLWS_Web_Load Scene_LLWS_Web_Save

	//=============================================================================
	// Window_Choice
	//=============================================================================

//Window_Choice
	function Window_Choice(){
		this.initialize.apply(this,arguments);
	}
	Window_Choice.prototype=Object.create(Window_Command.prototype);
	Window_Choice.prototype.constructor=Window_Choice;

	Window_Choice.prototype.initialize=function(){
		Window_Command.prototype.initialize.call(this,0,0);
		this.updatePlacement();//Change Window Positin
		this.openness=0;//Record Open Time
		this.selectLast();// Last Choice (Maybe)
	};

	Window_Choice._lastCommandSymbol=null;

	Window_Choice.initCommmandPosition=function(){
		this._lastCommandSymbol = null;
	};

	//Window_Choice.prototype.windowWidth=function(){
	//	return this.width;
	//};

	Window_Choice.prototype.updatePlacement=function(){
		this.x=(Graphics.boxWidth-this.width)/2;
		this.y=(Graphics.boxHeight-this.height)/2;
	};

	Window_Choice.prototype.makeCommandList = function(){
		this.addCommand(LLWS.paramList.LocalName,'local',LLWS.NowAction=="load"?this.isLocalContinueEnable():true);
		this.addCommand(LLWS.paramList.WebName,'web',this.isWebContinueEnable());
		this.addCommand(LLWS.paramList.CancelName,'cancel');
		this.addCommand(LLWS.paramList.LogoutName,'logout',LLWS.CanLogin());
		this.addCommand(LLWS.paramList.SaveFileControlName,'control');
	};

	Window_Choice.prototype.isWebContinueEnable=function(){
		return navigator.onLine;
	};

	Window_Choice.prototype.isLocalContinueEnable=function(){
		var json;
		var globalInfo=null;
		var i;
		try {
			json = LLWS.StorageManager_load.call(StorageManager,0);
		} catch (e) {
			console.error(e);
			globalInfo= [];
		}
		if (json) {
			globalInfo = JSON.parse(json);
			for (i = 1; i <= DataManager.maxSavefiles(); i++) {
				if (!LLWS.StorageManager_exists.call(StorageManager,i)) {
					delete globalInfo[i];
				}
			}
		} else {
			globalInfo=[];
		}
    	if (globalInfo) {
    	    for ( i = 1; i < globalInfo.length; i++) {
				if (globalInfo[i]) {
					if (StorageManager.isLocalMode()) {
						return true;
					} else {
						var savefile = globalInfo[i];
						if(savefile.globalId === DataManager._globalId &&
								savefile.title === $dataSystem.gameTitle){
									return true;
						}
					}
				}
			} 
    	}
    	return false;
	};

	if(Imported.SF_ExportSaveFile){
        Window_Choice.prototype.isLocalContinueEnable=function(){
            return true;
        };
    }

	Window_Choice.prototype.processOK=function(){
		Window_Choice._lastCommandSymbol=this.currentSymbol();
		Window_Command.prototype.processOK.call(this);
	};

	Window_Choice.prototype.selectLast=function(){
		if(Window_Choice._lastCommandSymbol){
			this.selectSymbol(Window_Choice._lastCommandSymbol);
		}
	};

	function Window_Login(){
		this.initialize.apply(this);
	}

	Window_Login.prototype=Object.create(Window_Base.prototype);
	Window_Login.prototype.constructor=Window_Login;

	Window_Login.prototype.initialize=function(){
		var width=this.windowWidth();
		var height=this.windowHeight();
		var x=(Graphics.boxWidth-width)/2;
		var y=(Graphics.boxHeight-(height+this.fittingHeight(9)+8))/2;
		Window_Base.prototype.initialize.call(this,x,y,width,height);
		
	};


	
	//=============================================================================
	// Scene_Choice
	//=============================================================================

	//Choose Load/Save From/To Web Or Local
	function Scene_LLWS_Choice() {
		this.initialize.apply(this, arguments);
	}
	Scene_LLWS_Choice.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_LLWS_Choice.prototype.constructor = Scene_LLWS_Choice;
	window.Scene_LLWS_Choice=Scene_LLWS_Choice;

	//creat this Scene
	Scene_LLWS_Choice.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		//LLWS.UserAction=LoadFile;
		//this.createBackground();
		//this.createWindowLayer();
		this.createCommandWindow();
	};

	//when Scene start run this
	Scene_LLWS_Choice.prototype.start=function(){
		Scene_MenuBase.prototype.start.call(this);
	};

	//when Scene update run this
	Scene_LLWS_Choice.prototype.update=function(){
		if (!this.isBusy()){
			this._commandWindow.open();
		}
		Scene_MenuBase.prototype.update.call(this);
	};

	//when Scene close run this
	Scene_LLWS_Choice.prototype.terminate=function(){
		Scene_MenuBase.prototype.terminate.call(this);
	};

	Scene_LLWS_Choice.prototype.isBusy=function(){
		return this._commandWindow.isClosing()||Scene_MenuBase.prototype.isBusy.call(this);
	};

	Scene_LLWS_Choice.prototype.createCommandWindow=function(){
		this._commandWindow = new Window_Choice();
		this._commandWindow.setHandler('local',this.commandLocal.bind(this));
		this._commandWindow.setHandler('web',this.commandWeb.bind(this));
		this._commandWindow.setHandler('cancel',this.commandCancel.bind(this));
		this._commandWindow.setHandler('logout',this.commandLogout.bind(this));
		this._commandWindow.setHandler('control',this.commandControl.bind(this));
		this.addWindow(this._commandWindow);
	};

	Scene_LLWS_Choice.prototype.commandLocal=function(){
		LLWS.FromWhere="local";
		if(LLWS.NowAction=="save"){
			SceneManager.goto(Scene_Save);
		}else if(LLWS.NowAction=="load"){
			SceneManager.goto(Scene_Load);
		}
	};

	Scene_LLWS_Choice.prototype.commandWeb=function(){
		console.log("Web");
		LLWS.FromWhere="web";
		if(!LLWS.CanLogin()){
			SceneManager.goto(Scene_LLWS_Login);
		}else if(LLWS.NowAction=="save"){
			SceneManager.goto(Scene_Save);
		}else if(LLWS.NowAction=="load"){
			SceneManager.goto(Scene_Load);
		}
	};
	Scene_LLWS_Choice.prototype.commandCancel=function(){
		console.log("Cancel");
		SceneManager.pop();
	};
	Scene_LLWS_Choice.prototype.commandLogout=function(){
		console.log("Logout");
		SceneManager.pop();
		LLWS.UserName=null;
		LLWS.PassWord=null;
		LLWS.FromWhere="local";
	};

	Scene_LLWS_Choice.prototype.commandControl=function(){
		window.location.href="./LocalStorageControl/index.html"
	};


	
	//=============================================================================
	// Scene_Login
	//=============================================================================

	function Scene_LLWS_Login(){
		this.initialize.apply(this,arguments);
	}

	Scene_LLWS_Login.prototype=Object.create(Scene_MenuBase.prototype);
	Scene_LLWS_Login.prototype.constructor=Scene_LLWS_Login;

	Scene_LLWS_Login.prototype.initialize=function(){
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_LLWS_Login.prototype.create=function(){
		Scene_MenuBase.prototype.create.call(this);
		this.addLoginDiv();
		
		Input.removeEventHandlers();
		TouchInput.removeEventHandlers();
		Input.clear();
		TouchInput.clear();
	};

	Scene_LLWS_Login.prototype.terminate=function(){
		Scene_MenuBase.prototype.terminate.call(this);
		document.body.removeChild(this.loginElem.div);
		Input._setupEventHandlers();
		TouchInput._setupEventHandlers();
	};

	Scene_LLWS_Login.prototype.addLoginDiv=function(){
		this.loginElem={};
		this.loginElem.div=document.createElement("div");
		var w=(Graphics.width-250)*Graphics._realScale;
		var h=(Graphics.height-150)*Graphics._realScale;
		this.loginElem.div.setAttribute("style"," width: "+w+"px; height: "+h+"px;background-color:rgba(0,0,0,0.3);margin: auto; top: 0px; left: 0px; right: 0px; bottom: 0px;z-index:100;position:absolute;")
		this.loginElem.div.innerHTML="<form style=\"height: 100%; \"><div style=\"width: 100%;  height: 20%; float: left;\"> <div style=\"color:#fff; float: left;width: 40%; margin:0px; font-size: 20px;line-height:" + h / 5 + "px;height: 100%;text-align: center;\">\u6E38\u620F\u540D\u79F0</div><input style=\"float: left;width: 55%; background-color:rgba(0,0,0,0.3); font-size: 20px;  border:0;color:rgba(255,255,255,1); height: 90%;\" type=\"text\" readonly=\"readonly\" id=\"gameName\"></div><div style=\"width: 100%;  height: 20%; float: left;\"> <div style=\"color:#fff; float: left;width: 40%; margin:0px; font-size: 20px;line-height:" + h / 5 + "px;height: 100%;text-align: center;\">\u6E38\u620F\u7248\u672C</div><input style=\"float: left;width: 55%; background-color:rgba(0,0,0,0.3); font-size: 20px;  border:0;color:rgba(255,255,255,1); height: 90%;\" type=\"text\" readonly=\"readonly\"  id =\"gameVersion\"></div><div style=\"width: 100%;  height: 20%; float: left;\"> <div style=\"color:#fff; float: left;width: 40%; margin:0px; font-size: 20px;line-height:" + h / 5 + "px;height: 100%;text-align: center;\">\u7528\u6237\u540D</div><input style=\"float: left;width: 55%; background-color:rgba(0,0,0,0.3); font-size: 20px; border:0;color:rgba(255,255,255,1); height: 90%;\" type=\"text\" id='userName'></div><div style=\"width: 100%;  height: 20%; float: left;\"> <div style=\"color:#fff; float: left;width: 40%; margin:0px; font-size: 20px;line-height:" + h / 5 + "px;height: 100%;text-align: center;\">\u5BC6\u7801</div><input style=\"float: left;width: 55%; background-color:rgba(0,0,0,0.3); font-size: 20px;  border:0;color:rgba(255,255,255,1); height: 90%;\" type=\"passwprd\"; oncopy=\"return false;\";oncut=\"return false;\"; id=\"password\"></div>  <div style=\"color:#fff; width: 100%; height: 20%;float: left;\"> <div style=\"border\uFF1A3px solid \uFF03fff;background-color:rgba(0,0,0,0.3); width: 50%; height: 100%;float: left;line-height:" + h / 5 + "px;text-align: center; font-size: 20px;\"id=\"return\">\u8FD4\u56DE\u6E38\u620F</div><div style=\" font-size: 20px;background-color:rgba(0,0,0,0.3); width: 50%; height: 100%;float: left;text-align: center;line-height:" + h / 5 + "px\"id='login'>\u767B\u5F55\u6216\u6CE8\u518C</div>   </div></form>";
		document.body.appendChild(this.loginElem.div);

		this.loginElem.gameNameInput=document.getElementById("gameName");
		this.loginElem.gameVersionInput=document.getElementById("gameVersion");
		this.loginElem.userNameInput=document.getElementById("userName");
		this.loginElem.passwordInput=document.getElementById("password");
		this.loginElem.loginButton=document.getElementById("login");
		this.loginElem.returnButton=document.getElementById("return");

		this.loginElem.gameNameInput.setAttribute("value",LLWS.paramList.GameName);
		this.loginElem.gameVersionInput.setAttribute("value",LLWS.paramList.GameVersion);
		
		this.loginElem.returnButton.addEventListener("click",this.Return.bind(this));
		this.loginElem.loginButton.addEventListener("click",this.Login.bind(this));;
	};



	
	Scene_LLWS_Login.prototype.Login=function(){
		var name=this.loginElem.userNameInput.value;
		var password=this.loginElem.passwordInput.value;
		if(name.length==0||password.length==0){return ;}
		LLWS.UserName=encodeURIComponent(name);
		LLWS.PassWord=encodeURIComponent(password);
		if(LLWS.NowAction=="load"){
			LLWS.NowAction=null;
			SceneManager.goto(Scene_Load);
			LLWS.Sync();
		}else if(LLWS.NowAction=="save"){
			LLWS.NowAction=null;
			SceneManager.goto(Scene_Save);
			LLWS.Sync();
		}else{
			SceneManager.pop();
		}

	};
	
	Scene_LLWS_Login.prototype.Return=function(){
		SceneManager.pop();
	};

}());