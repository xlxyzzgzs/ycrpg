//=============================================================================
// InheritanceArchive.js
/*:
 * @plugindesc v0.1 Inheritance Archive 
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * 
 * try to solve Extract Error when load old save file.
 * but this may causing load slowly
 * please put it on the top of plugins list
 */
//=============================================================================

(function(){
    function IA() {
        throw new Error('This is a static class');
    }
    
    IA._id = 1;
    IA._generateId = function(){
        return IA._id++;
    };

    IA._restoreCircularReference = function(circulars){
        circulars.forEach(function(circular){
            var key = circular[0];
            var value = circular[1];
            var content = circular[2];
    
            value[key] = content;
        });
    };

    IA._linkCircularReference = function(contents, circulars, registry){
        circulars.forEach(function(circular){
            var key = circular[0];
            var value = circular[1];
            var id = circular[2];
    
            value[key] = registry[id];
        });
    };
    
    IA._cleanMetadata = function(object){
        if(!object) return;
    
        delete object['@'];
        delete object['@c'];
    
        if(typeof object === 'object'){
            Object.keys(object).forEach(function(key){
                var value = object[key];
                if(typeof value === 'object'){
                    JsonEx._cleanMetadata(value);
                }
            });
        }
    };
    
    IA._getConstructorName = function(value) {
        var name = value.constructor.name;
        if (name === undefined) {
            var func = /^\s*function\s*([A-Za-z0-9_$]*)/;
            name = func.exec(value.constructor)[1];
        }
        return name;
    };

    IA._resetPrototype = function(value, prototype) {
        if (Object.setPrototypeOf !== undefined) {
            Object.setPrototypeOf(value, prototype);
        } else if ('__proto__' in value) {
            value.__proto__ = prototype;
        } else {
            var newValue = Object.create(prototype);
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    newValue[key] = value[key];
                }
            }
            value = newValue;
        }
        return value;
    };
    DataManager.extractSaveContents=function(contents){
        IA.extractSaveContent($gameSystem,contents.system);
        IA.extractSaveContent($gameScreen,contents.screen);
        IA.extractSaveContent($gameTimer,contents.timer);
        IA.extractSaveContent($gameSwitches,contents.switches);
        IA.extractSaveContent($gameVariables,contents.variables);
        IA.extractSaveContent($gameSelfSwitches,contents.selfSwitches);
        IA.extractSaveContent($gameActors,contents.actors);
        IA.extractSaveContent($gameParty,contents.party);
        IA.extractSaveContent($gameMap,contents.map);
        IA.extractSaveContent($gamePlayer,contents.player);
    };

    /**    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        registry[value['@c']] = value;

        if (value['@']) {
            var constructor = window[value['@']];
            if (constructor) {
                value = this._resetPrototype(value, constructor.prototype);
            }
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if(value[key] && value[key]['@a']){
                    //object is array wrapper
                    var body = value[key]['@a'];
                    body['@c'] = value[key]['@c'];
                    value[key] = body;
                }
                if(value[key] && value[key]['@r']){
                    //object is reference
                    circular.push([key, value, value[key]['@r']])
                }
                value[key] = this._decode(value[key], circular, registry);
            }
        }
    }
    return value; 
    
    if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                if(value[key] && typeof value[key] === 'object'){
                    if(value[key]['@c']){
                        circular.push([key, value, value[key]]);
                        value[key] = {'@r': value[key]['@c']};
                    }else{
                        value[key] = this._encode(value[key], circular, depth + 1);

                        if(value[key] instanceof Array){
                            //wrap array
                            circular.push([key, value, value[key]]);

                            value[key] = {
                                '@c': value[key]['@c'],
                                '@a': value[key]
                            };
                        }
                    }
                }else{
                    value[key] = this._encode(value[key], circular, depth + 1);
                }
            }
        }*/

    IA.extractSaveContent=function(dst,src){
        var circular = [];
        JsonEx._id = 1;
        var registry = {};
        this._extract(dst,src,circular,registry);
        
    };

    IA._extract=function(dst,src,circular,registry){
        var type=Object.prototype.toString.call(src);
        if (type === '[object Object]' || type === '[object Array]') {
        
            var constructorName = JsonEx._getConstructorName(src);
            if (constructorName !== 'Object' && constructorName !== 'Array') {
                dst = JsonEx._resetPrototype(dst, window[constructorName].prototype);
            }

            for (var key in src) {
                if(src[key] && typeof src[key] === 'object'){
                    if(value[key]['@c']){
                        circular.push([key, value, value[key]]);
                        value[key] = {'@r': value[key]['@c']};
                    }else{
                        value[key] = this._encode(value[key], circular, depth + 1);

                        if(value[key] instanceof Array){
                            //wrap array
                            circular.push([key, value, value[key]]);

                            value[key] = {
                                '@c': value[key]['@c'],
                                '@a': value[key]
                            };
                        }
                    }
                }else{
                    dst[key] = IA.extractSaveContent(dst[key],src[key]);
                }
                
            }
        }
        return src;
    };



    IA.DataManager_loadGameWithoutRescue=DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function (savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            this.setupNewGame();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };
})();
