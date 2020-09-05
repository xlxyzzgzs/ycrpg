//=============================================================================
// ZJZB_Sprite_MiniMap.js
//=============================================================================

/*:
 * @plugindesc 带战争迷雾小地图插件
 * @author 海峰Nguyen  QQ:312454893
 *
 * @param MiniMapimg
 * @desc 小地图图片
 * @default minimap
 *
 * @param ChooseImg
 * @desc 小地图选择指示的动态图片
 * @default minimapfax
 *
 * @param ActorImg
 * @desc 角色在小地图显示的图片
 * @default minimapactor
 *
 * @param Mapid
 * @desc 显示小地图的地图只能一张
 * @default 1
 *
 * @help
 *
 * Plugin Command:
 *   事件里执行脚本 $gameSystem.showminmap(x,y);地图上xy坐标显示选中标记
 *   事件里执行脚本 $gameSystem.hideminmap();隐藏标记,标记不会自动隐藏
 *   小地图支持点击放大
 *   小地图闪动城镇,闪动洞岳等在ZJZB_Sprite_MiniMap_Data.js设置
 */
	var $zjzbdivdata = {};

	var parameters = PluginManager.parameters('MimiMap');
	var unknownData = String(parameters['MiniMapimg'] || 'minimap');
	var priceText = String(parameters['ChooseImg'] || 'minimapfax');
	var actorImg = String(parameters['ActorImg'] || 'minimapactor');
	var showmapid = parseInt(parameters['Mapid'] || '1');
	Game_System.prototype.showminmap = function(x,y) {
		if(SceneManager._scene._spriteset && SceneManager._scene._spriteset._minimap){
			SceneManager._scene._spriteset._minimap.setMain();
			SceneManager._scene._spriteset._minimap.setChoose(x,y);
			SceneManager._scene._spriteset._minimap.visible = true;
		}
	};

	Game_System.prototype.hideminmap = function() {
		if(SceneManager._scene._spriteset && SceneManager._scene._spriteset._minimap){
			SceneManager._scene._spriteset._minimap.unsetChoose();
			SceneManager._scene._spriteset.updateMiniMap();
		}
	};
	DataManager.saveGame = function(savefileId) {
		//保存小地图
		if($zjzbdivdata._minimapbitmap){
			$gameMap._minimapbitmap = $zjzbdivdata._minimapbitmap.__canvas.toDataURL("image/png");
		}
		try {
			StorageManager.backup(savefileId);
			return this.saveGameWithoutRescue(savefileId);
		} catch (e) {
			console.error(e);
			try {
				StorageManager.remove(savefileId);
				StorageManager.restoreBackup(savefileId);
			} catch (e2) {
			}
			return false;
		}
	};
	ImageManager.loadBitmapsrc = function(path) {
		if (path) {
			var bitmap = this.loadNormalBitmapsrc(path, 360);
			bitmap.smooth = false;
			return bitmap;
		} else {
			return this.loadEmptyBitmap();
		}
	};
	ImageManager.loadNormalBitmapsrc = function(path, hue) {
		var key = this._generateCacheKey(path, hue);
		var bitmap = this._imageCache.get(key);
		if (!bitmap) {
			bitmap = Bitmap.load(path,true);
			bitmap.addLoadListener(function() {
				bitmap.rotateHue(hue);
			});
			this._imageCache.add(key, bitmap);
		}else if(!bitmap.isReady()){
			bitmap.decode();
		}

		return bitmap;
	};
	Bitmap.load = function(url,norecode) {
		//norecode = norecode ? norecode:true;
		var bitmap = Object.create(Bitmap.prototype);
		bitmap._defer = true;
		bitmap.initialize();

		bitmap._decodeAfterRequest = true;
		bitmap._requestImage(url,norecode);

		return bitmap;
	};
	Bitmap.prototype._requestImage = function(url,norecode){
		norecode = norecode ? norecode:false;
		if(Bitmap._reuseImages.length !== 0){
			this._image = Bitmap._reuseImages.pop();
		}else{
			this._image = new Image();
		}

		if (this._decodeAfterRequest && !this._loader) {
			this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
		}

		this._image = new Image();
		this._url = url;
		this._loadingState = 'requesting';

		if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages && !norecode) {
			this._loadingState = 'decrypting';
			Decrypter.decryptImg(url, this);
		} else {
			this._image.src = url;

			this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
			this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
		}
	};
	Scene_Map.prototype.processMapTouch = function() {
		if (TouchInput.isTriggered() || this._touchCount > 0) {
			if (TouchInput.isPressed()) {
				if (this._touchCount === 0 || this._touchCount >= 15) {
					if($gameMap.mapId()!=showmapid || TouchInput.x >270 || TouchInput.y >180){
						var x = $gameMap.canvasToMapX(TouchInput.x);
						var y = $gameMap.canvasToMapY(TouchInput.y);
						$gameTemp.setDestination(x, y);
					}
				}
				this._touchCount++;
			} else {
				this._touchCount = 0;
			}
		}
	};
	Spriteset_Map.prototype.createLowerLayer = function() {
		Spriteset_Base.prototype.createLowerLayer.call(this);
		this.createParallax();
		this.createTilemap();
		this.createCharacters();
		this.createShadow();
		this.createDestination();
		this.createMiniMap();
		this.createWeather();
	};
	Spriteset_Map.prototype.createMiniMap = function() {//小地图
		this._minimap = new Sprite_MiniMap();
		//this._minimap.setMin();
		this.updateMiniMap();
		this.addChild(this._minimap);
	};
	Spriteset_Map.prototype.updateMiniMap = function() {
		this._minimap.setMin();
		if(showmapid == $gameMap.mapId())
			this._minimap.show();
		else
			this._minimap.hide();
		this._minimap.show();
	};
	function Sprite_MiniMap() {
		this.initialize.apply(this, arguments);
	}

	Sprite_MiniMap.prototype = Object.create(Sprite_Base.prototype);
	Sprite_MiniMap.prototype.constructor = Sprite_MiniMap;

	Sprite_MiniMap.prototype.initialize = function() {
		Sprite_Base.prototype.initialize.call(this);
		this._touching = false;
		this.bitmap = ImageManager.loadSystem('minimap');
		this.createChild();
	};
	Sprite_MiniMap.prototype.createChild = function() {
		//人物位置
		this._actor = new Sprite_DiyLightning();
		this._actor.bitmap = ImageManager.loadSystem('minimapactor');
		if($gameMap._minimapx || $gameMap._minimapy){
			this._actor.x = $gameMap._minimapx;
			this._actor.y = $gameMap._minimapy;
		}
		//this._actor.bitmap.fillRect(0, 0, 15, 15, 'red');
		this._actor.anchor.x = 0.5;
		this._actor.anchor.y = 0.5;
		this.addChild(this._actor);
		//地图上的点
		var data = minimapfax();//传送
		var faxdata = {};
		for(var i=0;i<data.length;i++){
			faxdata[i] = new Sprite_DiyLightning();
			faxdata[i].bitmap = new Bitmap(data[i].s,data[i].s);
			faxdata[i].bitmap.fillRect(0, 0, data[i].s, data[i].s, data[i].c);
			faxdata[i].x = data[i].x*2;
			faxdata[i].y = data[i].y*2;
			faxdata[i].anchor.x = 0.5;
			faxdata[i].anchor.y = 0.5;
			this.addChild(faxdata[i]);
		}
		//黑色档
		this._black = new Sprite();
		if($zjzbdivdata._minimapbitmap){
			this._black.bitmap = $zjzbdivdata._minimapbitmap;
		}else{
			if($gameMap._minimapbitmap){
				this._black.bitmap = ImageManager.loadBitmapsrc($gameMap._minimapbitmap);
			}else{
				this._black.bitmap = new Bitmap(150,100);
				this._black.bitmap.fillRect(0, 0, 150, 100, '#000');
			}
			$zjzbdivdata._minimapbitmap = this._black.bitmap;
		}
		this._black.scale.x = this.scale.x*10;
		this._black.scale.y = this.scale.y*10;
		this.addChild(this._black);
		//选择
		this._choose = new Sprite_DiyLightning1();
		this._choose.bitmap = ImageManager.loadSystem('minimapfax');
		this._choose.anchor.x = 0.5;
		this._choose.anchor.y = 0.5;
		this._choose.visible = false;
		this.addChild(this._choose);
		//this.setChoose(100,100);
	};
	Sprite_MiniMap.prototype.unsetChoose = function() {
		this._choose.visible = false;
	};
	Sprite_MiniMap.prototype.setChoose = function(x,y) {
		this._choose.visible = true;
		this._choose.x = x*2;
		this._choose.y = y*2;
		this._black.bitmap.clearRect((x-16)/5, (y-14)/5, 6,6);
	};
	Sprite_MiniMap.prototype.setMax = function() {
		this.y=0;
		this.scale.x = Graphics.boxWidth/1500;
		this.scale.y = Graphics.boxHeight/1000;
	};
	Sprite_MiniMap.prototype.setMain = function() {
		this.y=0;
		this.scale.x = 0.43;
		this.scale.y = 0.43;
	};
	Sprite_MiniMap.prototype.setFax = function() {
		this.y=220;
		this.scale.x = (Graphics.boxWidth-530)/1500;
		this.scale.y = (Graphics.boxWidth-530)/1500;
	};
	Sprite_MiniMap.prototype.setMin = function() {
		this.y=0;
		this.scale.x = 0.18;//270
		this.scale.y = 0.18;//180
	};
	Sprite_MiniMap.prototype.update = function() {
		Sprite.prototype.update.call(this);
		if(this.visible && $gameMap.mapId()==showmapid){
			if($gamePlayer.x || $gamePlayer.y){
				$gameMap._minimapx = $gamePlayer.x*2;
				$gameMap._minimapy = $gamePlayer.y*2;
				this._actor.x = $gamePlayer.x*2;
				this._actor.y = $gamePlayer.y*2;
				this._black.bitmap.clearRect(($gamePlayer.x-9)/5, ($gamePlayer.y-7)/5, 3,3);
			}
		}
		this.processTouch();
	};
	//触摸效果
	Sprite_MiniMap.prototype.callClickHandler = function() {
		$gameTemp.clearDestination();
		if(SceneManager._scene.constructor != Scene_BigMap){
			SceneManager.push(Scene_BigMap);
		}
	};

	Sprite_MiniMap.prototype.processTouch = function() {
		if (this.isActive()) {
			if (TouchInput.isTriggered() && this.isButtonTouched()) {
				this._touching = true;
			}
			if (this._touching) {
				if (TouchInput.isReleased() || !this.isButtonTouched()) {
					this._touching = false;
					if (TouchInput.isReleased()) {
						this.callClickHandler();
					}
				}
			}
		} else {
			this._touching = false;
		}
	};

	Sprite_MiniMap.prototype.isActive = function() {
		var node = this;
		while (node) {
			if (!node.visible) {
				return false;
			}
			node = node.parent;
		}
		return true;
	};

	Sprite_MiniMap.prototype.isButtonTouched = function() {
		var x = this.canvasToLocalX(TouchInput.x);
		var y = this.canvasToLocalY(TouchInput.y);
		return x >= 0 && y >= 0 && x < this.bitmap.width*this.scale.x && y < this.bitmap.height*this.scale.y;
	};

	Sprite_MiniMap.prototype.canvasToLocalX = function(x) {
		var node = this._effectTarget;
		while (node) {
			if(node.anchor)
				x -= node.x-node.anchor.x*node.width;
			else
				x -= node.x;
			node = node.parent;
		}
		return x;
	};

	Sprite_MiniMap.prototype.canvasToLocalY = function(y) {
		var node = this._effectTarget;
		while (node) {
			if(node.anchor)
				y -= node.y-node.anchor.y*node.height;
			else
				y -= node.y;
			node = node.parent;
		}
		return y;
	};
	//大地图场景
	function Scene_BigMap() {
		this.initialize.apply(this, arguments);
	}

	Scene_BigMap.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_BigMap.prototype.constructor = Scene_BigMap;

	Scene_BigMap.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};
	Scene_BigMap.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this._commandWindow = new Window_Command();
		this._commandWindow.setHandler('cancel',this.popScene.bind(this));
		this._commandWindow.hide();
		this.addWindow(this._commandWindow);
		this._minimap = new Sprite_MiniMap();
		this._minimap.setMax();
		this.addChild(this._minimap);
	};
	//闪的sprite
	function Sprite_DiyLightning() {
		this.initialize.apply(this, arguments);
	}

	Sprite_DiyLightning.prototype = Object.create(Sprite_Base.prototype);
	Sprite_DiyLightning.prototype.constructor = Sprite_DiyLightning;

	Sprite_DiyLightning.prototype.initialize = function() {
		this._sstep = 80;
		Sprite_Base.prototype.initialize.call(this);
	};
	Sprite_DiyLightning.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this._sstep--;
		if(this._sstep<=30){
			this.opacity -= 10;
		}
		if(this._sstep<=0){
			this._sstep = 120;
			this.opacity = 255;
		}
	};
	//fax变大选择
	function Sprite_DiyLightning1() {
		this.initialize.apply(this, arguments);
	}

	Sprite_DiyLightning1.prototype = Object.create(Sprite_Base.prototype);
	Sprite_DiyLightning1.prototype.constructor = Sprite_DiyLightning1;

	Sprite_DiyLightning1.prototype.initialize = function() {
		this.count = 0;
		Sprite_Base.prototype.initialize.call(this);
	};
	Sprite_DiyLightning1.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.scale.x = 1.3 + Math.cos(this.count) * 0.5;
		this.scale.y = 1.3 + Math.cos(this.count) * 0.5;
		this.count += 0.06;
	};
