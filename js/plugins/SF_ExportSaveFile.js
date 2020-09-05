//=============================================================================
// SF_ExportSaveFile.js
//=============================================================================
/*:
 * @plugindesc export save file by downloading file
 * @author SF
 * 
 * @help
 * try to export save file by downloading in Scene_File
 * require Yep_SaveCore.js
 * file name is the same as the name in localStorage
 * try to support import save file
 * 
 * @param Delete Command
 * @desc Text for the delete command in the action window.
 * @default Delete
 * @type text
 * 
 * @param Import Command
 * @desc Text for the import command in the action window.
 * @default Import
 * @type text
 * 
 * @param Export Command
 * @desc Text for the export command in the action window.
 * @default Export
 * @type text
 * 
 * @param Category Command
 * @desc Text for the category command in the action window.
 * @default Other
 * @type text
 */
"use strict";

 var Imported = Imported||{};
 Imported.SF_ExportSaveFile=true;

 var SF_Plugins = SF_Plugins||{};
 if(Imported.YEP_SaveCore){

(function(){
    var SF_ExportSaveFile={};
    SF_Plugins.SF_ExportSaveFile=SF_ExportSaveFile;

    SF_ExportSaveFile.parameters=PluginManager.parameters('SF_ExportSaveFile');
    SF_ExportSaveFile.deleteCommandName=String(SF_ExportSaveFile.parameters['Delete Command']);
    SF_ExportSaveFile.importCommandName=String(SF_ExportSaveFile.parameters['Import Command']);
    SF_ExportSaveFile.exportCommandName=String(SF_ExportSaveFile.parameters['Export Command']);
    SF_ExportSaveFile.CategoryCommandName=String(SF_ExportSaveFile.parameters['Category Command']);

    SF_ExportSaveFile.Window_SaveAction_makeCommandList=Window_SaveAction.prototype.makeCommandList;
    Window_SaveAction.prototype.makeCommandList = function() {
        var id = this.savefileId();
        var enabled = DataManager.isThisGameFile(id);
        var valid = DataManager.loadSavefileInfo(id);
        this.addCommand(this.getCommandName('load'), 'load', valid);
        this.addCommand(this.getCommandName('save'), 'save', this.isSaveEnabled());
        this.addCommand(this.getCommandName('category'), 'category');
    };

    SF_ExportSaveFile.Window_SaveAction_getCommandName=Window_SaveAction.prototype.getCommandName;
    Window_SaveAction.prototype.getCommandName=function(type){
        if(type ==='category'){
            return SF_ExportSaveFile.CategoryCommandName;
        } else {
            return SF_ExportSaveFile.Window_SaveAction_getCommandName.apply(this,arguments);
        }
    };


    function Window_SF_SaveAction(){
        this.initialize.apply(this,arguments);
    }

    Window_SF_SaveAction.prototype=Object.create(Window_Command.prototype);
    Window_SF_SaveAction.prototype.constructor=Window_SF_SaveAction;

    Window_SF_SaveAction.prototype.initialize=function(){
        Window_Command.prototype.initialize.call(this,0,0);
        this._currentFile = 0;
        this.deactivate();
        this.deselect();
        this.close();
        this.openness=0;
        this.updatePosition();
    };
    
    Window_SF_SaveAction.prototype.makeCommandList=function(){
        var id = this.savefileId();
        var enabled = DataManager.isThisGameFile(id);
        var valid = DataManager.loadSavefileInfo(id);
        this.addCommand(SF_ExportSaveFile.deleteCommandName,'delete',enabled);
        this.addCommand(SF_ExportSaveFile.importCommandName,'import');
        this.addCommand(SF_ExportSaveFile.exportCommandName,'export',enabled);
    };
    
    Window_SF_SaveAction.prototype.updatePosition=function(){
        this.x=(Graphics.boxWidth-this.width)/2;
        this.y=(Graphics.boxHeight-this.height)/2;
    };

    Window_SF_SaveAction.prototype.itemTextAlign=function(){
        return 'center';
    };

    Window_SF_SaveAction.prototype.windowHeight=function(){
        return this.fittingHeight(3);
    };

    Window_SF_SaveAction.prototype.savefileId = function() {
        return SceneManager._scene._listWindow.index() + 1;
    };

    Window_SF_SaveAction.prototype.update=function(){
        Window_Command.prototype.update.call(this);
        if(this._currentFile!=this.savefileId()) this.updateIndex();
    };

    Window_SF_SaveAction.prototype.updateIndex=function(){
        this._currentFile=this.savefileId();
        this.refresh();
    };

    SF_ExportSaveFile.Scene_File_create=Scene_File.prototype.create;
    Scene_File.prototype.create=function(){
        SF_ExportSaveFile.Scene_File_create.call(this);
        this.create_SF_ActionWindow();
    };

    Scene_File.prototype.create_SF_ActionWindow=function(){
        this._SF_actionWindow=new Window_SF_SaveAction();
        this._SF_actionWindow.setHandler('delete',this.onActionDelete.bind(this));
        this._SF_actionWindow.setHandler('import',this.onActionImport.bind(this));
        this._SF_actionWindow.setHandler('export',this.onActionExport.bind(this));
        this._SF_actionWindow.setHandler('cancel',this.on_SF_CategoryCancel.bind(this));
        this.addWindow(this._SF_actionWindow);
    };

    Scene_File.prototype.onActionExport=function(){
        var  id = this.savefileId();
        var data={};
        data.globalinfo=DataManager.loadGlobalInfo()[id];
        data.savefile=StorageManager.load(id);
        var str="data:text/json;charset=utf-8,"+encodeURIComponent(JsonEx.stringify(data));
        var download=document.createElement('a');
        download.setAttribute('href',str);
        download.setAttribute('download',StorageManager.webStorageKey(id)+'.json');
        download.style.display='none';
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
        this.on_SF_CategoryCancel();
    };

    Scene_File.prototype.onActionImport=function(){
        var input=document.createElement('input');
        input.setAttribute('type','file');
        //input.setAttribute('accept','.json');
        input.addEventListener('change',function(){
            var fr=new FileReader();
            fr.onload=function(){
                var id=SceneManager._scene._listWindow.index()+1;
                var json=JsonEx.parse(decodeURIComponent(fr.result));
                var globalinfo=DataManager.loadGlobalInfo();
                if(!globalinfo) globalinfo=[];
                globalinfo[id]=json.globalinfo;
                DataManager.saveGlobalInfo(globalinfo);
                StorageManager.save(id,json.savefile);
                SceneManager._scene._infoWindow.updateIndex();
                SceneManager._scene._infoWindow.updateTimer();
                SceneManager._scene._actionWindow.refresh();
                SceneManager._scene._listWindow.refresh();
                SceneManager._scene._SF_actionWindow.refresh();
            };
            fr.readAsText(this.files[0]);
        });
        input.click();
        this.on_SF_CategoryCancel();
    };

    Scene_File.prototype.on_SF_CategoryCancel=function(){
        var index=this._actionWindow.index();
        this._SF_actionWindow.deactivate();
        this._SF_actionWindow.close();
        this.onSavefileOk();
        this._actionWindow.select(index);
    };

    SF_ExportSaveFile.Scene_File_createActionWindow=Scene_File.prototype.createActionWindow;
    Scene_File.prototype.createActionWindow=function(){
        SF_ExportSaveFile.Scene_File_createActionWindow.apply(this,arguments);
        this._actionWindow.setHandler('category', this.onActionCategory.bind(this));
    };

    Scene_File.prototype.onActionCategory=function(){
        this._SF_actionWindow.open();
        this._SF_actionWindow.activate();
        this._SF_actionWindow.select(0);
    };

    SF_ExportSaveFile.Scene_File_onActionDelete=Scene_File.prototype.onActionDelete;
    Scene_File.prototype.onActionDelete=function(){
        this.on_SF_CategoryCancel();
        this.performActionDelete();
        this._SF_actionWindow.refresh();
    };

    

})();

 } else {
     console.error('SF_ExportSaveFile require Yep Save Core');
 }