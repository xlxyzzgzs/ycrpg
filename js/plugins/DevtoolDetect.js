//=============================================================================
// DevtoolDetect.js
/*:
 * @plugindesc v0.1 detect debugger
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * 
 * try to detect devtools by debugger.
 * 
 * @param exec
 * @desc eval this when detect devtools."this" is SceneManager.
 * @default ""
 */
//=============================================================================
(function(){
    var dd=PluginManager.parameters("DevtoolDetect");
    var code=dd.exec;
    SceneManager_update=SceneManager.update;
    SceneManager.update=function(){
        var allow=100;
        var start = +new Date(); // Validation of built-in Object tamper prevention.
        /*jshint -W087*/ 
        debugger;
        var end = +new Date(); // Validates too.
        if(isNaN(start) || isNaN(end) || end - start > allow) {
            // input your code here when devtools detected.
            try{
                /*jshint -W061*/ 
                eval(code);
            } catch(e){
                console.log(e.name);
                console.log(e.message);
                console.log(e.stack);
            }
          }
        SceneManager.update.call(this,arguments);
    };
})();