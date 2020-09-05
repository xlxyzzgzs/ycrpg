//=============================================================================
// 8-dir move.js
/*:
 * @plugindesc 8-dir move 
 * @author Chiba Kunase.
 *
 * @help 
 * just trace on.
 */
//=============================================================================
(function(){
    Game_Player.prototype.getInputDirection = function() {
        return Input.dir8;
    };
     
    Game_Player.prototype.executeMove = function(direction) {
        if (direction % 2 == 0)
        this.moveStraight(direction);
        if (direction == 1||direction ==3)
        this.moveDiagonally(direction+3 , 2);
        if (direction == 7||direction == 9)
        this.moveDiagonally(direction-3 , 8) ;
    };
    
    Game_CharacterBase_moveDiagonally=Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        var h=this.canPass(this._x, this._y, horz);
        var v=this.canPass(this._x,this._y,vert);
        this.setMovementSuccess(h||v);
        if (this.isMovementSucceeded()) {
            if(h&&!v){
                this.moveStraight(horz);
            } else if (!h&&v){
                this.moveStraight(vert);
            } else {
                Game_CharacterBase_moveDiagonally.call(this,horz,vert);
            }
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }
    };
}())
