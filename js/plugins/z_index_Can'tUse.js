//=============================================================================
// z-index.js
/*:
 * @plugindesc support z-index 
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * add this at the top
 * (CAUTION: this will rewrite some pixi function )
 */
//=============================================================================
(function () {
    //var tmpArrivalCounter = 0;

    function awesomeCompare(a, b) {
      if (a.z > b.z) return 1;
      if (a.z < b.z) return -1;
      return 0;
    }

	PIXI_Container_prototype_renderWebGL = PIXI.Container.prototype.renderWebGL;
	PIXI.Container.prototype.renderWebGL = function (render) {
		// if the object is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return;
        }

        // do a quick check to see if this element has a mask or a filter.
        if (this._mask || this._filters) {
            this.renderAdvancedWebGL(renderer);
        } else {
            this._renderWebGL(render);

            // simple render children!
            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.zOrderchildren[i].renderWebGL(renderer);
            }
        }
    };
    
    PIXI_DisplayObject=PIXI.DisplayObject;
    PIXI.DisplayObject=function(){
        this.z=0;
        //this.arrivalOrder=tmpArrivalCounter++;
        return PIXI_DisplayObject.call(this,arguments);
    };

    PIXI_Container_prototype_onChildrenChange=PIXI.Container.prototype.onChildrenChange;
    PIXI.Container.prototype.onChildrenChange=function(){
        PIXI_Container_prototype_onChildrenChange.call(this,arguments);
        this.sortChildren();
    };


	Object.defineProperties(PIXI.DisplayObject.prototype, {
		z: {
			get: function () {
				if (this._zIndex != null) {
                    this._zIndex=0;
					return this._zIndex;
				}
				return this._zIndex;
			},
			set: function (value) {
				this.zOld = this._zIndex || 0;
				this._zIndex = value;
				if (this.parent) this.parent.sortChildren();
				return value;
			}
		}
	});
	PIXI.DisplayObject.prototype.sortChildren = function sortChildren() {
        var children=this.zOrderchildren;
        var tmpChanged = [], tmpOld = [];

		var len = children.length;
		for (var i = 0; i < len; i++) {
			elem = children[i];

			if (elem.z !== elem.zOld) {
				tmpChanged.push(elem);
			} else {
				tmpOld.push(elem);
			}
			elem.zOld = elem.z;
		}

		if (tmpChanged.length === 0) {
			tmpOld.length = 0;
			return;
		}
		if (tmpChanged.length > 1) {
			tmpChanged.sort(awesomeCompare);
		}

		var j = 0,
			a = 0,
			b = 0;
		while (a < tmpChanged.length && b < tmpOld.length) {
			if (awesomeCompare(tmpChanged[a], tmpOld[b]) < 0) {
				children[j++] = tmpChanged[a++];
			} else {
				children[j++] = tmpOld[b++];
			}
		}
		while (a < tmpChanged.length) {
			children[j++] = tmpChanged[a++];
		}
		while (b < tmpOld.length) {
			children[j++] = tmpOld[b++];
		}

		tmpChanged.length = 0;
		tmpOld.length = 0;
    };
    
    PIXI_Container_prototype_addChild=PIXI.Container.prototype.addChild;
    PIXI.Container.prototype.addChild = function addChild(child) {
        var argumentsLength = arguments.length;

        // if there is only one argument we can bypass looping through the them
        if (argumentsLength > 1) {
            // loop through the arguments property and add all children
            // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
            for (var i = 0; i < argumentsLength; i++) {
                this.addChild(arguments[i]);
            }
        } else {
            if(!this.zOrderchildren){this.zOrderchildren=[];}
            this.zOrderchildren.push(child);
           PIXI_Container_prototype_addChild.call(this,arguments);
        }

        return child;
    };

    PIXI_Container_prototype_addChildAt=PIXI.Container.prototype.addChildAt;
    PIXI.Container.prototype.addChildAt = function addChildAt(child, index) {
        if (index < 0 || index > this.children.length) {
            throw new Error(child + 'addChildAt: The index ' + index + ' supplied is out of bounds ' + this.children.length);
        }
        this.zOrderchildren.push(child);
        return PIXI_Container_prototype_addChildAt.call(this,arguments);
    };


}());