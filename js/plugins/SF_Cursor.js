//=============================================================================
// SF_Cursor.js
/*:
 * @plugindesc windows selectable cursor
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * Thanks galvs-scripts.com
 * require img/system/cursor.png
 * Change From GALV_CursorImage.js and MOG_MenuCursor
 */
//=============================================================================

(function(){
    Cursor={};
    Cursor.imgUrl='img/system/Cursor.png';
    Cursor.offsetx=0; // px
    Cursor.offsety=0; // px
    Cursor.moveSpeed=0.3;  // px
    Cursor.moveDirection="horizontal"; //"horizontal" : x  , "vertical" : y
    Cursor.moveRange=8; // px
    Cursor.iIndent = 0; // Indent items and skills in menus to make room for the cursor if required
    Cursor.cIndent=0; //Indent commands in menus to make room for the cursor if required
    
    // Spirit_Cursor

    function Sprite_Cursor(){
        this.initialize.apply(this,arguments);
    }

    Sprite_Cursor.prototype = Object.create(Sprite_Base.prototype);
    Sprite_Cursor.prototype.constructor = Sprite_Cursor;

    Sprite_Cursor.prototype.initialize = function(window){
        Sprite_Base.prototype.initialize.call(this);
        this._window = window;
        this.createImage();
        this._ticker = 0;
        this.offsetx = 0;
        this.offsety = 0;
        this.nowMoingDirction=1; // 1,-1
        this.moveDirection=null;
        this.move_x=0;
        this.move_y=0;
    };

    Sprite_Cursor.prototype.createImage = function(){
        this.bitmap = ImageManager.loadNormalBitmap(Cursor.imgUrl);
        this.opacity=0;
    };

    Sprite_Cursor.prototype.update = function(){
        Sprite_Base.prototype.update.call(this);
        if(this._window.isCursorVisible()&&!$gameSystem._cursorHidden){
            this.opacity = this._window.openness >= 255 ? 255 : 0;
            this.updatePosition();
            if(this._window.isHorizontal()){
                this.moveDirection="vertical";
            }else{
                this.moveDirection="horizontal";
            }
            if(this._window.active) this.updateMoving();
        } else {
            this.opacity=0;
        }
    };

    Sprite_Cursor.prototype.updatePosition = function(){
        var rect = this._window._cursorRect;
        var Direction=this.moveDirection?this.moveDirection:Cursor.moveDirection;
        if(Direction=="horizontal"){
            this.y = rect.y + Cursor.offsety+this.offsety+this._window.standardPadding()+this.yPos(rect.height)-this.yPos(this.height);
            this.x = rect.x + Cursor.offsetx+this.offsetx-this.width-Cursor.moveRange+this._window.standardPadding();
            if(this._window.position.x+this.x<0){
                this.x = rect.x + Cursor.offsetx+this.offsetx+rect.width-this._window.standardPadding();
            }
        } else if(Direction=="vertical") {
            this.y = rect.y + Cursor.offsety+this.offsety-this.height-Cursor.moveRange+this._window.standardPadding();
            this.x = rect.x + Cursor.offsetx+this.offsetx+this._window.standardPadding()+this.yPos(rect.width)-this.yPos(this.width);
            if(this.y+this._window.position.y<0){
                this.y = rect.y + Cursor.offsety+this.offsety+rect.height-this._window.standardPadding();
            }
        }
    };

    Sprite_Cursor.prototype.yPos = function(height){
        return height/2;
    };

    Sprite_Cursor.prototype.updateMoving = function(){
        var Direction=this.moveDirection?this.moveDirection:Cursor.moveDirection;
        if(Direction=="horizontal"){
            var offsetx=this.move_x+Cursor.moveSpeed*this.nowMoingDirction;
            if (offsetx>Cursor.moveRange){
                offsetx = 2*Cursor.moveRange-offsetx;
                this.nowMoingDirction*=-1;
            } else if (offsetx<-Cursor.moveRange){
                offsetx = -2 * Cursor.moveRange -offsetx;
                this.nowMoingDirction*=-1;
            }
            this.x=this.x+offsetx;
            this.move_x=offsetx;
        } else if(Direction=="vertical") {
            var offsety=this.move_y+Cursor.moveSpeed*this.nowMoingDirction;
            if (offsety>Cursor.moveRange){
                offsety = 2*Cursor.moveRange-offsety;
                this.nowMoingDirction*=-1;
            } else if (offsety<-Cursor.moveRange){
                offsety = -2 * Cursor.moveRange -offsety;
                this.nowMoingDirction*=-1;
            }
            this.y=this.y+offsety;
            this.move_y=offsety;
        }
    };

    // Pre cache
    Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function() {
	    Scene_Boot_loadSystemImages.call(this);
        ImageManager.loadNormalBitmap(Cursor.imgUrl);
    };

    Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
    	Game_System_initialize.call(this);
    	this._cursorHidden = false;
    };

    Window_NumberInput.prototype.createSFCursor = function() {
    };
    
    Window_ShopNumber.prototype.createSFCursor = function() {
    };
    
    Window_BattleStatus.prototype.createSFCursor = function() {
    };
    
    Window_Selectable.prototype.createSFCursor = function(){
        this._SFCursor = new Sprite_Cursor(this);
        this.addChild(this._SFCursor);
    };
   
    Window_BattleActor.prototype.createSFCursor = Window_Selectable.prototype.createSFCursor;

    Window_Selectable_initialize = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function(x, y, width, height) {
    	Window_Selectable_initialize.call(this,x,y,width,height);
    	this.createSFCursor();
    };

    Window_Command_textPadding = Window_Command.prototype.textPadding;
    Window_Command.prototype.textPadding = function() {
        return Window_Command_textPadding.call(this) + Cursor.cIndent;
    };
    
    Window_EquipSlot_drawText = Window_EquipSlot.prototype.drawText;
    Window_EquipSlot.prototype.drawText = function(text, x, y, maxWidth, align) {
        x += Cursor.iIndent;
        Window_EquipSlot_drawText.call(this,text,x,y,maxWidth,align);
    };
    
    Window_Selectable_drawItemName = Window_Selectable.prototype.drawItemName;
    Window_Selectable.prototype.drawItemName = function(item, x, y, width) {
        x += Cursor.iIndent;
        Window_Selectable_drawItemName.call(this,item,x,y,width);
    };
    
    Window_EquipSlot_drawIcon = Window_EquipSlot.prototype.drawIcon;
    Window_EquipSlot.prototype.drawIcon = function(iconIndex, x, y) {
        x += Cursor.iIndent;
        Window_EquipSlot_drawIcon.call(this,iconIndex, x, y);
    };
    
}());