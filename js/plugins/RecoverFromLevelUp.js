(function(){
    levelUp_Re=Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp=function(){
        levelUp_Re.call(this);
        this.recoverAll();
    };

    Scene_Gameover_gotoTitle=Scene_Gameover.prototype.gotoTitle;
    Scene_Gameover.prototype.gotoTitle = function() {
        DataManager.createGameObjects();
        DataManager.loadGame(0);
    };    
    /*
    var scale=1;
    var boxScale=2;
    SceneManager._screenHeight = window.innerHeight*scale;
    SceneManager._screenWidth  = window.innerWidth*scale;
    SceneManager._boxWidth     = window.innerWidth*boxScale;
    SceneManager._boxHeight    = window.innerHeight*boxScale;
    Graphics_initialize=Graphics.initialize;
    Graphics.initialize=function(width, height, type){
        width =window.innerWidth*scale;
        height=window.innerHeight*scale;
        Graphics_initialize.call(this,width, height, type);
        this._boxWidth=window.innerWidth*boxScale;
        this._boxHeight=window.innerHeight*boxScale;
        this._stretchEnabled=true;
    };
    Graphics._onWindowResize = function() {
        this._width=window.innerWidth*scale;
        this._height=window.innerHeight*scale;
        this._boxWidth=window.innerWidth*boxScale;
        this._boxHeight=window.innerHeight*boxScale;
        this._updateAllElements();
    };
    */
}());
