//=============================================================================
// ZJZB_Sprite_MiniMap_Data.js
//=============================================================================

/*:
 * @plugindesc 带战争迷雾小地图插件,城镇闪动点数据
 * @author 海峰Nguyen  QQ:312454893
 *
 * @help
 *
 *   具体数据打开文件直接添加
 */
minimapfax = function(){//城市闪动
	var data = [];
	
	//多少个城市 复制多少份改
	var tempdata = {};
	tempdata.x=3;//xy
	tempdata.y=3;
	tempdata.c='#0dff0d';//色号
	tempdata.s=15;//大小,一般15
	data.push(tempdata);
	//多少个城市 复制多少份改
	
	
	//多少个城市 复制多少份改
	var tempdata = {};
	tempdata.x=10;//xy
	tempdata.y=20;
	tempdata.c='#0dff0d';//色号
	tempdata.s=15;//大小,一般15
	data.push(tempdata);
	//多少个城市 复制多少份改
	
	
	return data;
}