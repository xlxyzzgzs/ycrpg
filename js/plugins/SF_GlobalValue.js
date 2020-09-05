//=============================================================================
//  SF_GlobalValue.js
//  v0.1
//=============================================================================

/*:
 * @plugindesc
 * v0.1 let game value can be used in different save files
 *
 * @author SF
 * 
 * @help 
 * 
 * use bellow function
 * SF_LoadWorldVar(valueid)
 * SF_SaveWorldVar(valueid)
 * 
 * @param GlobalValueList
 * @type number[]
 * @desc relation between gamevalue and global value
 * @default []
 * 
 */
"use strict";
var Imported=Imported||{};
Imported.SF_GlobalValue=true;
var SF_Plugins=SF_Plugins||{};
 (function(){
    var SF_GlobalValue={};
    SF_Plugins.SF_GlobalValue=SF_GlobalValue;
    SF_GlobalValue.Parameters=PluginManager.parameters("SF_GlobalValue");
    SF_GlobalValue.GlobalValueList=[];
    JsonEx.parse(SF_GlobalValue.Parameters.GlobalValueList).forEach(function(num){
        if(!isNaN(num)) SF_GlobalValue.GlobalValueList.push(Number(num));
    });

    window.SF_LoadWorldVar=function(index){
        var info=DataManager.loadGlobalInfo();
        var title=$dataSystem?$dataSystem.gameTitle:document.title;
        var id=SF_GlobalValue.GlobalValueList[index-1];
        title+=" Global Values";
        if((!info[0]) || (!info[0][title]) || (!info[0][title][id])) return false;
        $gameVariables.setValue(id,info[0][title][id]);
    };
    window.SF_SaveWorldVar=function(index){
        var info=DataManager.loadGlobalInfo();
        var title=$dataSystem?$dataSystem.gameTitle:document.title;
        var id=SF_GlobalValue.GlobalValueList[index-1];
        title+=" Global Values";
        if(!info[0]) info[0]={};
        if(!info[0][title]) info[0][title]={};
        info[0][title][id]=$gameVariables.value(id);
        DataManager.saveGlobalInfo(info);
    };

    SF_GlobalValue.DataManager_extractSaveContents=DataManager.extractSaveContents;
    DataManager.extractSaveContents=function(content){
        SF_GlobalValue.DataManager_extractSaveContents.call(this,arguments);
        var info=DataManager.loadGlobalInfo();
        var title=$dataSystem?$dataSystem.gameTitle:document.title;
        var id=SF_GlobalValue.GlobalValueList[index-1];
        title+=" Global Values";
        if((!info[0]) || (!info[0][title])) return;
        SF_GlobalValue.GlobalValueList.forEach(function(id){
            if(this[id]) $gameVariables.setValue(id,this[id]);
        },info[0][title]);
    };

    SF_GlobalValue.handle={
        get:function(obj,id){
            console.log("get");
            console.log(arguments);
            return obj[id];
        },
        set:function(obj,id,value){
            console.log("set");
            console.log(arguments);
            obj[id]=value;
            return obj;
        }
    };
})();