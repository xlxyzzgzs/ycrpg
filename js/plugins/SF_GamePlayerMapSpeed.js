//=============================================================================
// GamePlayerMapSpeed.js
//=============================================================================
var Imported = Imported || {};
Imported.GamePlayerMapSpeed = true;
//=============================================================================
 /*:
 * @plugindesc v0.01 (required YEP_OptionsCore.js)
 *  Change Player Move Speed On Map
 * @author SF
 *
 * @param SpeedMax
 * @desc Player Can Changed Max
 * @default 10
 *
 * @help
 * Make player can change player move speeed on Map scence
 * Add follow in YEP_OptionsCore setting 
 * Name:
 * \i[215]PlayerMoveSpeed
 *
 * ---Settings---
 *
 * HelpDesc:
 * Change Player Move Speed On Map
 *
 * Symbol:
 * PlayerSpeed
 *
 * ShowHide
 * show = Imported.GamePlayerMapSpeed;
 *
 * Enable
 * enabled = Imported.GamePlayerMapSpeed;
 *
 * Ext
 * ext = 0;
 *
 * ---Functions---
 *
 * MakeCommandCode
 * this.addCommand(name, symbol, enabled, ext);
 *
 * DrawItemCode
 * var rect = this.itemRectForText(index);
 * var statusWidth = this.statusWidth();
 * var titleWidth = rect.width - statusWidth;
 * this.resetTextColor();
 * this.changePaintOpacity(this.isCommandEnabled(index));
 * this.drawOptionsName(index);
 * var value = this.getConfigValue(symbol);
 * var rate = value / GamePlayerMapSpeed.MaxSpeed;
 * var gaugeColor1 = this.textColor(13);
 * var gaugeColor2 = this.textColor(5);
 * this.drawOptionsGauge(index, rate, gaugeColor1, gaugeColor2);
 * this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'center');
 *
 * ProcessOkCode
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * value += 1;
 * if (value > GamePlayerMapSpeed.MaxSpeed) value = 1;
 * this.changeValue(symbol, value);
 * 
 * CursorRightCode
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * value += 1;* if (value > GamePlayerMapSpeed.MaxSpeed) value = 1;
 * this.changeValue(symbol, value);
 * 
 * CursorLeftCode
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * value -= 1;* if (value < 1) value = GamePlayerMapSpeed.MaxSpeed;
 * this.changeValue(symbol, value);
 * 
 * DefaultConfigCode
 * ConfigManager[symbol] = 4;
 * 
 * SaveConfigCode
 * config[symbol] = ConfigManager[symbol];
 * 
 * LoadConfigCode
 * ConfigManager[symbol] = !!config[symbol];\""}
 *
 */
 //=============================================================================
 (function(){
	GamePlayerMapSpeed={};
	GamePlayerMapSpeed.Parameters = PluginManager.parameters('SF_GamePlayerMapSpeed');
	GamePlayerMapSpeed.MaxSpeed=GamePlayerMapSpeed.Parameters.SpeedMax;
	GamePlayerMapSpeed.ConfigManager_makedata=ConfigManager.makedata;
	ConfigManager.makedata=function(){
		var config=GamePlayerMapSpeed.ConfigManager_makedata.call(this);
		config.PlayerSpeed=this.PlayerSpeed?this.PlayerSpeed:4;
		if($gamePlayer){
			$gamePlayer._moveSpeed=config.PlayerSpeed;
		}
		return config;
	};
	GamePlayerMapSpeed.ConfigManager_applyData=ConfigManager.applyData;
	ConfigManager.applyData=function(config){
		GamePlayerMapSpeed.ConfigManager_applyData.call(this,config);
		if($gamePlayer){
			$gamePlayer._moveSpeed=config.PlayerSpeed||4;
		}
	};
	Object.defineProperty(ConfigManager, 'PlayerSpeed', {
		get: function() {
			return $gamePlayer?$gamePlayer._moveSpeed:4;
		},
		set: function(value) {
			if ($gamePlayer){
				$gamePlayer._moveSpeed=value;
			}
		},
		configurable: true
	});

	GamePlayerMapSpeed.Window_Options_statusText = Window_Options.prototype.statusText;
	Window_Options.prototype.statusText = function(index) {
	    var symbol = this.commandSymbol(index);
	    if (symbol === 'PlayerSpeed') {
	      return this.getConfigValue('PlayerSpeed');
	    } else {
	      return GamePlayerMapSpeed.Window_Options_statusText.call(this, index);
	    }
	};
})();
	