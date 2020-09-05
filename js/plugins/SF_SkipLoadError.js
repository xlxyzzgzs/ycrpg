/*:
 * ===============================
 * SF_SkipLoadError.js
 * ===============================
 * @plugindesc try to skip load errors
 * @author 莴瓜 @66rpg , SF
 * 
 * @help
 * just put it on the top of plugins list.
 */

var Imported=Imported||{};
Imported.SF_SkipLoadError=true;

var SF_Plugins=SF_Plugins||{};

(function(){

	var SF_SkipLoadError={};
	SF_Plugins.SF_SkipLoadError=SF_SkipLoadError;

	SF_SkipLoadError.PluginManager_checkErrors=PluginManager.checkErrors;
	PluginManager.checkErrors = function () {
		var url = this._errorUrls.shift();
		if (url) {
			alert('Failed to load: ' + url);
		}
	};
	
	SF_SkipLoadError.ImageManager_loadSvActor=ImageManager.loadSvActor;
	ImageManager.loadSvActor = function (filename, hue) {
		var fs = require("fs");
		var path = require("path");
		var folder = path.join(path.dirname(process.mainModule.filename), 'img/sv_actors/');
		var file = folder + filename + '.png';
		if (fs.existsSync(file)) {
			return this.loadBitmap('img/sv_actors/', filename, hue, false);
		} else {
			alert("Failed to load: " + file);
			return this.loadEmptyBitmap();
		}
	};
	
	SF_SkipLoadError.ImageManager_isReady=ImageManager.isReady;
	ImageManager.isReady = function () {
		for (var key in this.cache._inner) {
			var bitmap = this.cache._inner[key].item;
			if (bitmap.isError()) {
				alert('Failed to load: ' + bitmap.url);
				bitmap = ImageManager.loadEmptyBitmap();
				this.cache.setItem(key, bitmap);
			}
			if (!bitmap.isReady()) {
				return false;
			}
		}
		return true;
	};
	
	SF_SkipLoadError.AudioManager_checkWebAudioError=AudioManager.checkWebAudioError;
	AudioManager.checkWebAudioError = function (webAudio) {
		if (webAudio && webAudio.isError()) {
			alert('Failed to load: ' + webAudio.url);
			webAudio.initialize("");
		}
	};
	
	SF_SkipLoadError.FileLoadErrorList=[];
	SF_SkipLoadError.FileLoadingList=[];

	SF_SkipLoadError.ResourceHandler_createLoader=ResourceHandler.createLoader;
	ResourceHandler.createLoader = function(url, retryMethod, resignMethod, retryInterval) {
		retryInterval = retryInterval || this._defaultRetryInterval;
		var reloaders = this._reloaders;
		var retryCount = 0;
		if(!(url in SF_SkipLoadError.FileLoadingList)) SF_SkipLoadError.FileLoadingList.push(url);
		return function() {
			if (retryCount < retryInterval.length) {
				setTimeout(retryMethod, retryInterval[retryCount]);
				retryCount++;
			} else {
				//不调整状态并且不重试
				if (resignMethod) {
					resignMethod();
				}
				if (url) {
					var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
					if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
					Graphics.printLoadingError(url);
				}
				//reg=new RegExp("^([^/].?)(.*)","g");
				//if(url.substring(0,3)==="img"){
				//	Bitmap.prototype._onLoad.call(calledThis);
				//}
			}
		};
	};

	SF_SkipLoadError.Graphics_printLoadingError=Graphics.printLoadingError;
	Graphics.printLoadingError = function (url) {
		url=decodeURIComponent(url);
		console.warn(url);
		if (this._errorPrinter && !this._errorShowed && SF_SkipLoadError.FileLoadErrorList.indexOf(url)===-1) {
			SceneManager.stop();
			//console.log(this._errorPrinter.innerHTML);
			if(this._errorPrinter.innerHTML!==""){
				tempht=this._errorPrinter.innerHTML.match(/<font color="white">(.*)<\/font>/i)[1]+"<br/>";
				this._errorPrinter.innerHTML = '<font color="yellow"><b>' + '文件加载失败，请上报问题附带截图！' + '</b></font><br>' +
												'<font color="white">' + tempht + 'Failed to load: ' + url+ '</font><br>';
			}else{
				this._errorPrinter.innerHTML = this._makeErrorHtml('文件加载失败，请上报问题附带截图！', 'Failed to load: ' + url);
			}
			//console.log(this._errorPrinter.innerHTML)
			var button = document.createElement('button');
			SF_SkipLoadError.FileLoadErrorList.push(url);
			button.innerHTML = '继续';
			button.style.fontSize = '24px';
			button.style.color = '#ffffff';
			button.style.backgroundColor = '#000000';
			button.onmousedown = button.ontouchstart = function (event) {
				Graphics.eraseLoadingError();
				SceneManager.resume();
				event.stopPropagation();
			};
			this._errorPrinter.appendChild(button);
			this._loadingCount = -Infinity;
			return;
		}
		
	};

	SF_SkipLoadError.ResourceHandler_retry=ResourceHandler.retry;
	ResourceHandler.retry = function() {
		if (this._reloaders.length > 0) {
			Graphics.eraseLoadingError();
			SceneManager.resume();
			this._reloaders.length = 0;
		}
	};

	SF_SkipLoadError.Bitmap_onError=Bitmap.prototype._onError;
	Bitmap.prototype._onError = function() {
		this._image.removeEventListener('load', this._loadListener);
		this._image.removeEventListener('error', this._errorListener);
		//this._loadingState = 'error';
		this._loadListener();
	};

	SF_SkipLoadError.Graphics_paintUpperCanvas=Graphics._paintUpperCanvas;
	Graphics._paintUpperCanvas = function() {
		this._clearUpperCanvas();
		if (this._loadingImage){// && this._loadingCount >= 20) {
			var context = this._upperCanvas.getContext('2d');
			var dx = (this._width - this._loadingImage.width) / 2;
			var dy = (this._height - this._loadingImage.height) / 2;
			var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
			context.save();
			context.globalAlpha = alpha;
			context.drawImage(this._loadingImage, dx, dy);
			context.restore();
		} 
	};

	SF_SkipLoadError.WebAudio_onXhrLoad=WebAudio.prototype._onXhrLoad;
	WebAudio.prototype._onXhrLoad=function(xhr){
		var url=this._url||xhr.responseURL;
		var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
		if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
		return SF_SkipLoadError.WebAudio_onXhrLoad.call(this,xhr);
	};

	SF_SkipLoadError.Graphics_playVideo=Graphics.playVideo;
	Graphics.playVideo = function(src) {
		this._videoLoader = ResourceHandler.createLoader(src, this._playVideo.bind(this, src), this._onVideoError.bind(this));
		this._playVideo(src);
	};	

	SF_SkipLoadError.Graphics_onVideoLoad=Graphics._onVideoLoad;
	Graphics._onVideoLoad = function() {
		var url=this._video.src;
		var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
		if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
		return SF_SkipLoadError.Graphics_onVideoLoad.call(this);
	};

	Graphics_onVideoError=Graphics._onVideoError;
	Graphics._onVideoError = function() {
		var url=this._video.src;
		var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
		if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
		this._updateVisibility(false);
		this._videoLoading = false;
	};

	Bitmap_onLoad=Bitmap.prototype._onLoad;
	Bitmap.prototype._onLoad=function(){
		var url=this._url;
		var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
		if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
		return Bitmap_onLoad.call(this);
	};

	SF_SkipLoadError.DataManager_loadDataFile=DataManager.loadDataFile;
	DataManager.loadDataFile = function(name, src) {
		var xhr = new XMLHttpRequest();
		var url = 'data/' + src;
		xhr.open('GET', url);
		xhr.overrideMimeType('application/json');
		xhr.onload = function() {

			if (xhr.status < 400) {
				window[name] = JSON.parse(xhr.responseText);
				DataManager.onLoad(window[name]);
			}

			var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
			if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
			if(xhr.status==404)Graphics.printLoadingError(url);
		};
		xhr.onerror = this._mapLoader || function() {
			DataManager._errorUrl = DataManager._errorUrl || url;
		};
		window[name] = null;
		xhr.send();
	};

	SF_SkipLoadError.WebAudio_load=WebAudio.prototype._load;
	WebAudio.prototype._load = function(url) {
		if (WebAudio._context) {
			var xhr = new XMLHttpRequest();
			if(Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
			xhr.open('GET', url);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function() {
				if (xhr.status < 400) {
					this._onXhrLoad(xhr);
				}
				var index=SF_SkipLoadError.FileLoadingList.indexOf(url);
				if(index>=0) SF_SkipLoadError.FileLoadingList.splice(index,1);
				if(xhr.status==404)Graphics.printLoadingError(url);
			}.bind(this);
			xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
			xhr.send();
		}
	};
	

	SF_SkipLoadError.Scene_Base_isReady=Scene_Base.prototype.isReady;
	Scene_Base.prototype.isReady=function(){
		return SF_SkipLoadError.FileLoadingList.length===0&&SF_SkipLoadError.Scene_Base_isReady.call(this);
	};
}());
