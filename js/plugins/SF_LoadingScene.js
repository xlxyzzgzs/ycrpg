//=============================================================================
// SF_LoadingScene.js
//=============================================================================
/*~struct~tip:
 * @param tips
 * @desc random show when loading
 * @type text[]
 * @default []
 *  
 * @param initialize
 * @text  initialize function
 * @desc run this only once time when game started
 * @type note
 * @default ""
 * 
 * @param create
 * @text create function
 * @desc run this once when start loading
 * @type note
 * @default ""
 * 
 * @param update
 * @text update function
 * @desc run this each frame when in loading.
 * so you can use this to make animation
 * @type note
 * @default ""
 * 
 * @param terminate
 * @text terminate function
 * @desc run this when removed
 * @type note
 * @default ""
 * 
 * @param canExit
 * @text can Exit function
 * @desc call this each update after new scene loaded
 * @type note
 * @default "return true;"
 * 
 */

/*~struct~picture:
 * 
 * @param pictures
 * @desc loop as gif files
 * @type file[]
 * @default []
 * 
 * @param initialize
 * @text initilize function
 * @desc run this only once time when game started
 * @type note
 * @default ""
 * 
 * 
 * @param create
 * @text create function
 * @desc run this once when start loading
 * @type note
 * @default ""
 * 
 * @param update
 * @text update function
 * @desc run this each frame when in loading.
 * so you can use this to make animation
 * @type note
 * @default ""
 * 
 * @param terminate
 * @text terminate function
 * @desc run this when removed
 * @type note
 * @default ""
 * 
 * @param canExit
 * @text can Exit function
 * @desc call this in each update after new scene loaded
 * @type note
 * @default "return true;"
 * 
 */

/*:
 * @plugindesc Show Loading when loading
 * @author SaltedFish
 *
 * @help 
 * require SF_InputBindControl.js SF_SkipLoadError.js
 * loop these pictures as gif on loading game resource
 * 
 * @param loading picture
 * @desc SHow when loading
 * @type struct<picture>[]
 * @default []
 * 
 * @param fade speed
 * @desc the nunmber of speed that alpha(0~1) change per frame
 * @type number
 * @min 0
 * @max 1
 * @decimals 4
 * @default 0.1000
 * 
 * @param fading in
 * @desc loading scene fading in or not
 * @on enable
 * @off disable
 * @default true
 * @type boolean
 * 
 * @param fading out
 * @desc loading scene fading out or not
 * @on enable
 * @off disable
 * @default true
 * @type boolean
 * 
 * @param alpha min
 * @desc Scene fade alpha minimum
 * @type number
 * @decimals 4
 * @min 0
 * @max 1
 * @default 0.5000
 * 
 * @param all tips
 * @desc show tips when animation loops
 * @type struct<tip>[]
 * 
 * @param disabled fade scene
 * @desc these scene may be not faded
 * @type text[]
 * @default ["Scene_Boot"]
 * 
 */
//=============================================================================
"use strict";
var Imported = Imported || {};
Imported.SF_LoadingScene = true;
var SF_Plugins = SF_Plugins || {};

if (Imported.SF_InputBindControl && Imported.SF_SkipLoadError)

    (function () {

        var SF_LoadingScene = {};
        SF_Plugins.SF_LoadingScene = SF_LoadingScene;

        SF_LoadingScene.parameters = PluginManager.parameters('SF_LoadingScene');
        SF_LoadingScene.fadeSpeed = Number(SF_LoadingScene.parameters['fade speed']) || 0.1;
        SF_LoadingScene.needLoopSceneFadeIn = String(SF_LoadingScene.parameters['fade in']).toLowerCase() === "true";
        SF_LoadingScene.needLoopSceneFadeOut = String(SF_LoadingScene.parameters['fade out']).toLowerCase() === "true";
        SF_LoadingScene.alphaMin = Number(SF_LoadingScene.parameters['alpha min']);
        SF_LoadingScene.loadingTips = JsonEx.parse(SF_LoadingScene.parameters['all tips'])
            .map(function (tip) { return JsonEx.parse(tip); });
        SF_LoadingScene.loadingPictures = JsonEx.parse(SF_LoadingScene.parameters['loading picture'])
            .map(function (picture) { return JsonEx.parse(picture); });


        SF_LoadingScene.disabledFadeScene = JsonEx.parse(SF_LoadingScene.parameters['disabled fade scene']);

        SF_LoadingScene.upperCanvasStatues = null;
        /*  
            fading_out_old_scene 
            fading_in_loading_scene
            loop_loading_scene
            fading_out_loading_scene
            fading_in_new_scene
        */


        function LoadingScene_Text() {
            this.initialize.apply(this, arguments);
        }

        SF_LoadingScene.LoadingScene_Text = LoadingScene_Text;
        LoadingScene_Text.prototype = Object.create(PIXI.Text.prototype);
        LoadingScene_Text.prototype.constructor = LoadingScene_Text;

        LoadingScene_Text.prototype.initialize = function (tip) {
            PIXI.Text.call(this);
            this.allTips = JsonEx.parse(tip.tips);
            this.customFunc = {};
            this.customFunc.initialize = (new Function("tip", JsonEx.parse(tip.initialize))).bind(this, this);
            this.customFunc.create = (new Function("tip", JsonEx.parse(tip.create))).bind(this, this);
            this.customFunc.update = (new Function("tip", JsonEx.parse(tip.update))).bind(this, this);
            this.customFunc.terminate = (new Function("tip", JsonEx.parse(tip.terminate))).bind(this, this);
            this.customFunc.canExit = (new Function("tip", JsonEx.parse(tip.canExit))).bind(this, this);
            this.customFunc.initialize();
        };

        LoadingScene_Text.prototype.create = function () {
            this.customFunc.create();
        };

        LoadingScene_Text.prototype.update = function () {
            this.customFunc.update();
        };

        LoadingScene_Text.prototype.canExit = function () {
            return this.customFunc.canExit();
        };

        LoadingScene_Text.prototype.terminate = function () {
            this.customFunc.terminate();
        };

        function LoadingScene_Picture() {
            this.initialize.apply(this, arguments);
        }

        LoadingScene_Picture.prototype = Object.create(Sprite.prototype);
        LoadingScene_Picture.prototype.constructor = LoadingScene_Picture;
        SF_LoadingScene.LoadingScene_Picture = LoadingScene_Picture;

        LoadingScene_Picture.prototype.initialize = function (picture) {
            Sprite.prototype.initialize.apply(this, null);
            this.loopBitmaps = [];
            JsonEx.parse(picture.pictures).forEach(function (fileName) {
                this.loopBitmaps.push(Bitmap.load(fileName + '.png'));
            }, this);
            this.customFunc = {};
            this.customFunc.initialize = (new Function("picture", JsonEx.parse(picture.initialize))).bind(this, this);
            this.customFunc.create = (new Function("picture", JsonEx.parse(picture.create))).bind(this, this);
            this.customFunc.update = (new Function("picture", JsonEx.parse(picture.update))).bind(this, this);
            this.customFunc.terminate = (new Function("picture", JsonEx.parse(picture.terminate))).bind(this, this);
            this.customFunc.canExit = (new Function("picture", JsonEx.parse(picture.canExit))).bind(this, this);
            this.customFunc.initialize();
        };

        LoadingScene_Picture.prototype.create = function () {
            this.customFunc.create();
        };

        LoadingScene_Picture.prototype.update = function () {
            this.customFunc.update();
        };

        LoadingScene_Picture.prototype.fadingInEnded = function () {

        };

        LoadingScene_Picture.prototype.canExit = function () {
            return this.customFunc.canExit();
        };

        LoadingScene_Picture.prototype.terminate = function () {
            this.customFunc.terminate();
        };

        SF_LoadingScene.Graphics_setLoadingImage = Graphics.setLoadingImage;
        Graphics.setLoadingImage = function (src) {

            SF_LoadingScene.previousSceneSprite = new Sprite();
            SF_LoadingScene.nextSceneSprite = new Sprite();
            SF_LoadingScene.loadingScene = new PIXI.Container();

            SF_LoadingScene.allLoadingPictures = new PIXI.Container();
            SF_LoadingScene.loadingPictures.forEach(function (picture) {
                this.allLoadingPictures.addChild(new LoadingScene_Picture(picture));
            }, SF_LoadingScene);

            SF_LoadingScene.allLoadingTips = new PIXI.Container();
            SF_LoadingScene.loadingTips.forEach(function (tip) {
                this.allLoadingTips.addChild(new LoadingScene_Text(tip));
            }, SF_LoadingScene);

            SF_LoadingScene.loadingScene.addChild(SF_LoadingScene.allLoadingPictures);
            SF_LoadingScene.loadingScene.addChild(SF_LoadingScene.allLoadingTips);
            SF_LoadingScene.pixiRender = new PIXI.autoDetectRenderer({
                width: Graphics._width,
                height: Graphics._height,
                view: Graphics._upperCanvas,
                transparent: true,
                preserveDrawingBuffer: true,
                clearBeforeRender: true
            });

            SF_LoadingScene.upperCanvasStatues = "";
            SF_LoadingScene.animationFrameId = undefined;
            SF_LoadingScene.globalAlpha = undefined;
            SF_LoadingScene.totalCount = undefined;
            return;
        };

        SF_LoadingScene.Graphics_startLoading = Graphics.startLoading;
        Graphics.startLoading = function () {
            if (!isNaN(SF_LoadingScene.animationFrameId) || SF_Plugins.SF_SkipLoadError.FileLoadingList.length == 0) return;
            Graphics._canvas.style.opacity = 0;
            Graphics._upperCanvas.style.opacity = 1;

            if (SF_LoadingScene.disabledFadeScene.contains(SceneManager._scene.constructor.name)) {
                if (SF_LoadingScene.needLoopSceneFadeIn) {
                    SF_LoadingScene.fadingIn = true;
                    SF_LoadingScene.fadingOut = false;
                    SF_LoadingScene.upperCanvasStatues = "fading_in_loading_scene";
                    SF_LoadingScene.globalAlpha = SF_LoadingScene.alphaMin;
                } else {
                    SF_LoadingScene.fadingIn = false;
                    SF_LoadingScene.fadingOut = false;
                    SF_LoadingScene.upperCanvasStatues = "loop_loading_scene";
                    SF_LoadingScene.globalAlpha = 1;
                }
            } else {
                SF_LoadingScene.fadingIn = false;
                SF_LoadingScene.fadingOut = true;
                SF_LoadingScene.upperCanvasStatues = "fading_out_old_scene";
                SF_LoadingScene.globalAlpha = 1;
                SF_LoadingScene.previousSceneSprite.bitmap = SceneManager.snap();
            }

            SF_LoadingScene.allLoadingPictures.children.forEach(function (picture) {
                picture.create();
            });

            SF_LoadingScene.allLoadingTips.children.forEach(function (tip) {
                tip.create();
            });
            SF_LoadingScene.totalCount = 0;
            SF_LoadingScene.needContinue = true;
            SF_LoadingScene.newSceneLoaded = false;
            SF_LoadingScene.animationFrameId = window.requestAnimationFrame(SF_LoadingScene.animationOnUpperCanvas);
            return;

        };

        SF_LoadingScene.animationOnUpperCanvas = function () {
            SF_LoadingScene.totalCount++;

            Graphics._clearUpperCanvas();
            if (SF_LoadingScene.upperCanvasStatues == "fading_out_old_scene") {
                SF_LoadingScene.previousSceneSprite.alpha = SF_LoadingScene.globalAlpha;
                SF_LoadingScene.pixiRender.render(SF_LoadingScene.previousSceneSprite);
                if (SF_LoadingScene.globalAlpha <= SF_LoadingScene.alphaMin) {
                    if (SF_LoadingScene.needLoopSceneFadeIn) {
                        SF_LoadingScene.upperCanvasStatues = 'fading_in_loading_scene';
                        SF_LoadingScene.fadingIn = true;
                        SF_LoadingScene.fadingOut = false;
                    } else {
                        SF_LoadingScene.upperCanvasStatues = 'loop_loading_scene';
                        SF_LoadingScene.fadingIn = false;
                        SF_LoadingScene.fadingOut = false;
                        SF_LoadingScene.globalAlpha = 1;
                    }
                }
            } else if (SF_LoadingScene.upperCanvasStatues == "fading_in_loading_scene") {
                SF_LoadingScene.loadingScene.alpha = SF_LoadingScene.globalAlpha;
                SF_LoadingScene.updateLoadingScene();
                SF_LoadingScene.pixiRender.render(SF_LoadingScene.loadingScene);
                if (SF_LoadingScene.globalAlpha >= 1) {
                    SF_LoadingScene.fadingIn = false;
                    SF_LoadingScene.fadingOut = false;
                    SF_LoadingScene.upperCanvasStatues = "loop_loading_scene";
                }
            } else if (SF_LoadingScene.upperCanvasStatues == "loop_loading_scene") {
                SF_LoadingScene.loadingScene.alpha = SF_LoadingScene.globalAlpha;
                SF_LoadingScene.updateLoadingScene();
                SF_LoadingScene.pixiRender.render(SF_LoadingScene.loadingScene);
                if (SF_LoadingScene.canExitLoadingScene()) {
                    if (SF_LoadingScene.needLoopSceneFadeOut) {
                        SF_LoadingScene.fadingOut = true;
                        SF_LoadingScene.fadingIn = false;
                        SF_LoadingScene.upperCanvasStatues = "fading_out_loading_scene";
                    } else if (!SF_LoadingScene.disabledFadeScene.contains(SceneManager._scene.constructor.name)) {
                        SF_LoadingScene.fadingOut = false;
                        SF_LoadingScene.fadingIn = true;
                        SF_LoadingScene.globalAlpha = SF_LoadingScene.alphaMin;
                        SF_LoadingScene.upperCanvasStatues = "fading_in_new_scene";
                    } else {
                        SF_LoadingScene.needContinue = false;
                    }
                }
            } else if (SF_LoadingScene.upperCanvasStatues == "fading_out_loading_scene") {
                SF_LoadingScene.loadingScene.alpha = SF_LoadingScene.globalAlpha;
                SF_LoadingScene.updateLoadingScene();
                SF_LoadingScene.pixiRender.render(SF_LoadingScene.loadingScene);
                if (SF_LoadingScene.globalAlpha <= SF_LoadingScene.alphaMin) {
                    if (!SF_LoadingScene.disabledFadeScene.contains(SceneManager._scene.constructor.name)) {
                        SF_LoadingScene.fadingOut = false;
                        SF_LoadingScene.fadingIn = true;
                        SF_LoadingScene.globalAlpha = SF_LoadingScene.alphaMin;
                        SF_LoadingScene.upperCanvasStatues = "fading_in_new_scene";
                    } else {
                        SF_LoadingScene.needContinue = false;
                    }
                }
            } else if (SF_LoadingScene.upperCanvasStatues == "fading_in_new_scene") {
                SF_LoadingScene.nextSceneSprite.alpha = SF_LoadingScene.globalAlpha;
                SF_LoadingScene.pixiRender.render(SF_LoadingScene.nextSceneSprite);
                if (SF_LoadingScene.globalAlpha >= 1) {
                    SF_LoadingScene.needContinue = false;
                }
            } else {
                throw new SyntaxError('some error happen in SF_LoadingScene plugins');
            }

            SF_LoadingScene.updateUpperCanvasAlpha();
            if (SF_LoadingScene.needContinue) {
                SF_LoadingScene.animationFrameId = requestAnimationFrame(SF_LoadingScene.animationOnUpperCanvas);
            } else {
                SF_LoadingScene.endLoading();
            }
        };

        SF_LoadingScene.endLoading = function () {
            Graphics._clearUpperCanvas();
            SF_LoadingScene.terminateLoadingScene();
            Graphics._upperCanvas.style.opacity = 0;
            Graphics._canvas.style.opacity = 1;
            SF_LoadingScene.animationFrameId = undefined;
            SceneManager.resume();
        };

        SF_LoadingScene.updateLoadingScene = function () {
            SF_LoadingScene.loadingScene.children.forEach(function (child) {
                child.children.forEach(function (child) {
                    child.update();
                });
            });
        };

        SF_LoadingScene.canExitLoadingScene = function () {
            return SF_LoadingScene.newSceneLoaded && SF_LoadingScene.loadingScene.children.every(function (child) {
                return child.children.every(function (child) {
                    return child.canExit();
                });
            });
        };

        SF_LoadingScene.terminateLoadingScene = function () {
            SF_LoadingScene.loadingScene.children.forEach(function (child) {
                child.children.forEach(function (child) {
                    child.terminate();
                });
            });
        };

        SF_LoadingScene.updateUpperCanvasAlpha = function () {
            if (SF_LoadingScene.fadingIn) {
                SF_LoadingScene.globalAlpha = (SF_LoadingScene.globalAlpha + SF_LoadingScene.fadeSpeed).clamp(0, 1);
            } else if (SF_LoadingScene.fadingOut) {
                SF_LoadingScene.globalAlpha = (SF_LoadingScene.globalAlpha - SF_LoadingScene.fadeSpeed).clamp(0, 1);
            }
        };


        SF_LoadingScene.Graphics_endLoading = Graphics.endLoading;
        Graphics.endLoading = function () {
            if (SceneManager._nextScene || isNaN(SF_LoadingScene.animationFrameId)) return;
            if (!SF_LoadingScene.disabledFadeScene.contains(SceneManager._scene.constructor.name))
                SF_LoadingScene.nextSceneSprite.bitmap = SceneManager.snap();
            SF_LoadingScene.newSceneLoaded = true;
            SceneManager.stop();
        };

        SF_LoadingScene.Graphics_updateLoading = Graphics.updateLoading;
        Graphics.updateLoading = function () { };

        SF_LoadingScene.Graphics_clearUpperCanvas = Graphics._clearUpperCanvas;
        Graphics._clearUpperCanvas = function () {
            if (SF_LoadingScene.pixiRender) {
                SF_LoadingScene.pixiRender.clear();
            } else {
                SF_LoadingScene.Graphics_clearUpperCanvas.apply(this, arguments);
            }
        };

    })();

else {
    alert("Need SF_InputBindControl and SF_SkipLoadError");
}
