//=============================================================================
// BattleCry.js
/*:
 * @plugindesc BattleCry
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * need change this file
 * Thanks mog
 * Change From MOG_BattleCry.js
 */
//=============================================================================

(function () {
	BC = {};
	BC.DataFrom = "BattleCry.json";

	BC.v_volume = 100;
	BC.v_actor_start = [];
	BC.v_actor_turn = [];
	BC.v_actor_default_action = [];
	BC.v_actor_skill = [];
	BC.v_actor_item = [];
	BC.v_actor_damage = [];
	BC.v_actor_evaded = [];
	BC.v_actor_dead = [];
	BC.v_actor_recover = [];
	BC.v_actor_counter = [];
	BC.v_actor_reflection = [];
	BC.v_actor_victory = [];
	BC.v_actor_levelup = [];
	BC.v_actor_escape = [];
	BC.v_enemy_default_action = [];
	BC.v_enemy_damage = [];
	BC.v_enemy_evaded = [];
	BC.v_enemy_counter = [];
	BC.v_enemy_reflection = [];
	BC.v_enemy_dead = [];
	BC.v_enemy_recover = [];
	BC.v_enemy_skill = [];

	//Example:	
	//  BC.v_actor_item[10]={
	//	  'special':[{'condition':'condition','voiceList':['list',...]},...],
	//	  'general':['voiceList',...]
	//  };

	BC.MakeData = function () {
		FileDirInSE = 'BattleCry/';
		FileVoiceDir = 'audio/se/' + FileDirInSE;
		FileType = ['.m4a'];
		ACTOR_NAME = [];
		ACTOR_NAME[11] = '郝仁';
		ACTOR_NAME[2] = '莉莉';
		//ACTOR_NAME[12] = '莉莉';
		ACTOR_NAME[13] = '薇薇安';
		ACTOR_NAME[18] = '南宫五月';
		ACTOR_NAME[15] = '南宫三八';
		ACTOR_NAME[27] = '年轻的修士';
		ACTOR_NAME[26] = '大胡子';
		ACTOR_NAME[14] = '渡鸦12345';
		ACTOR_NAME[16] = '伊扎克斯';
		ACTOR_NAME[17] = '龙';
		ACTOR_NAME[20] = '巨龟岩台号';
		ACTOR_NAME[21] = '贝琪';
		ACTOR_NAME[23] = '希尔妲';
		ACTOR_NAME[24] = '海瑟安娜';
		ACTOR_NAME[25] = '赫斯珀瑞撕';
		ENEMY_NAME = [];
		ENEMY_NAME[31] = '薇薇安';
		ENEMY_NAME[32] = '薇薇安';
		// 战斗开始
		BATTLE_START = '战斗开始';
		// 战斗结束
		BATTLE_END = '胜利';
		// 战斗撤退
		BATTLE_ESCAPE = '撤退';
		// 战斗失败
		BATTLE_LOSE = '失败';
		// 轮到自己行动
		TURN_ACTIVE = '回合开始';
		// 使用技能（通用）
		SKILL = '使用技能';
		// 使用道具（通用）
		ITEM = '使用道具';
		// 通用行动语音 *( STANDARD / FOR ALL SKILLS / ITEMS)
		GENERAL_ACTION = '使用技能';
		// 受到伤害
		DAMAGE = '受击';
		// 被治疗
		RECOVER = '被治疗';
		// 战斗不能
		DEAD = '死亡';
		// 角色升级
		LEVEL_UP = '升级';

		ACTOR_BATTLE_START_SPECIAL = [];
		ACTOR_BATTLE_END_SPECIAL = [];
		ACTOR_BATTLE_ESCAPE_SPECIAL = [];
		ACTOR_BATTLE_LOSE_SPECIAL = [];
		ACTOR_TURN_ACTIVE_SPECIAL = [];
		ACTOR_SKILL_SPECIAL = [];
		ACTOR_ITEM_SPECIAL = [];
		ACTOR_GENERAL_ACTION_SPECIAL = [];
		ACTOR_DAMAGE_SPECIAL = [];
		ACTOR_RECOVER_SPECIAL = [];
		ACTOR_DEAD_SPECIAL = [];
		ACTOR_LEVEL_UP_SPECIAL = [];
		ENEMY_DEFAULT_ACTION_SPECIAL = [];
		ENEMY_DAMAGE_SPECIAL = [];
		ENEMY_EVADED_SPECIAL = [];
		ENEMY_REFLECTION_SPECIAL = [];
		ENEMY_DEAD_SPECIAL = [];
		ENEMY_RECOVER_SPECIAL = [];
		ENEMY_SKILL_SPECIAL = [];


		// 特殊语音部分
{		// ACTOR TURN
		ACTOR_TURN_ACTIVE_SPECIAL[2]=[
			{
				'condition': 'return $gameActors._data[2].isisStateAffected(31)',
				'fileName':ACTOR_NAME[2]+'/（二哈）可以行动',
			}
		];
}

{		// SKILL SPECIAL
		ACTOR_SKILL_SPECIAL[11] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[11]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==91;',
				'fileName': ACTOR_NAME[11]+'/特殊技能（挑衅）'
			},
			{

			}
		];
		ACTOR_SKILL_SPECIAL[2] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return (id==1||id==138||id==216)&&(!this.isStateAffected(31));',
				'fileName': ACTOR_NAME[2]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return (id==1||id==138||id==216)&&(this.isStateAffected(31));',
				'fileName': ACTOR_NAME[2]+'/（二哈）攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return (!(id==1||id==138||id==216))&&(this.isStateAffected(31));',
				'fileName': ACTOR_NAME[2]+'/（二哈）使用技能'
			}
		];

		ACTOR_SKILL_SPECIAL[13] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[13]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==132;',
				'fileName': ACTOR_NAME[13]+'/特殊技能语音'
			}
		];

		ACTOR_SKILL_SPECIAL[18] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[18]+'/攻击'
			},
			{	/*jshint multistr: true */
				'condition': 'var id=BattleManager._action.item().id;return id==170;',
				'fileName': ACTOR_NAME[18]+'/特殊技能（海洋赞歌）'
			},
		];

		ACTOR_SKILL_SPECIAL[15] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[15]+'/攻击'
			}
		];

		ACTOR_SKILL_SPECIAL[27] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[27]+'/攻击'
			}
		];

		ACTOR_SKILL_SPECIAL[26] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[26]+'/攻击'
			}
		];

		ACTOR_SKILL_SPECIAL[14] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ACTOR_NAME[14]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==118;',
				'fileName': ACTOR_NAME[14]+'/（女神的庇护）特殊语音'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==117;',
				'fileName': ACTOR_NAME[14]+'/（神罚）特殊语音'
			}
		];
		//----------------------------------------------------------------------------
		// 敌人使用技能（特殊）
		//----------------------------------------------------------------------------
		ENEMY_SKILL_SPECIAL = [];

		ENEMY_SKILL_SPECIAL[31] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ENEMY_NAME[31]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==132;',
				'fileName': ENEMY_NAME[31]+'/特殊技能语音'
			}
		];
		ENEMY_SKILL_SPECIAL[32] = [
			{
				'condition': 'var id=BattleManager._action.item().id;return id==1||id==138||id==216;',
				'fileName': ENEMY_NAME[31]+'/攻击'
			},
			{
				'condition': 'var id=BattleManager._action.item().id;return id==132;',
				'fileName': ENEMY_NAME[31]+'/特殊技能语音'
			}
		];
}

{		// RECOVER SPECIAL
		ACTOR_RECOVER_SPECIAL[18]=[
			{
				'condition': 'var flag=false;var unit=this.targetsForFriends();for(var i=0;i<unit.length;i++){if(unit[i]._actorId==18) flag=true;} ;return flag;',
				'fileName': ACTOR_NAME[18]+'/特殊语音（治疗自己）'
			},
		];

		ACTOR_RECOVER_SPECIAL[15]=[
			{
				'condition': 'var flag=false;var unit=this.targetsForFriends();for(var i=0;i<unit.length;i++){if(unit[i]._actorId==15) flag=true;} ;return flag;',
				'fileName': ACTOR_NAME[18]+'/特殊语音（治疗三八）'
			},
			{
				'condition': 'return this._subjectActorID==18;',
				'fileName': ACTOR_NAME[18]+'/特殊语音（治疗三八）'
			}
		];
}

{		// BATTLE END SPECIAL
		ACTOR_BATTLE_END_SPECIAL[18]=[
			{
				'condition':'var flag=false;var unit=$gameParty.aliveMembers();for(var i in unit){if(unit[i]._actorId==15) flag=true;};return flag;',
				'fileName':ACTOR_NAME[18]+'/特殊语音（胜利且队伍中有三八）'
			},
		];

		ACTOR_BATTLE_END_SPECIAL[15]=[
			{
				'condition':'var flag=false;var unit=$gameParty.aliveMembers();for(var i in unit){if(unit[i]._actorId==18) flag=true;};return flag;',
				'fileName':ACTOR_NAME[18]+'/特殊语音（胜利且队伍中有五月）'
			},
		];
}

{		// DEAD SPECIAL
		ACTOR_DEAD_SPECIAL[18] = [
			{
				'condition':'var flag=false;var unit=$gameParty.aliveMembers();for(var i in unit){if(unit[i]._actorId==15) flag=true;};return flag;',
				'fileName':ACTOR_NAME[15]+'/特殊语音（五月落败）'
			}
		];

		ACTOR_DEAD_SPECIAL[2] = [
			{
				'condition':'return $gameActors._data[2].isisStateAffected(31)',
				'fileName':ACTOR_NAME[2]+'/（二哈）死亡'
			}
		];
}

{		// DAMAGE SPECIAL
		ACTOR_DAMAGE_SPECIAL[2]=[
			{
				'conditon':'return $gameActors._data[2].isisStateAffected(31)',
				'fileName':ACTOR_NAME[2]+'/（二哈）被攻击',
			}
		];
}

{		// RECOVER SPECIAL
		ACTOR_RECOVER_SPECIAL[2]=[
			{
				'conditon':'return $gameActors._data[2].isisStateAffected(31)',
				'fileName':ACTOR_NAME[2]+'/（二哈）被治疗',
			}
		];
}
		MakeOneInfoForOne = function (ActorID, list, fileName) {
			if (!list[ActorID]) list[ActorID] = { 'special': [], 'general': [] };
			for (m = 1; ; m++) {
				xhr = new XMLHttpRequest();
				xhr.open('GET',FileVoiceDir+ fileName+ String(m) + '.m4a', false);
				xhr.send();
				if (xhr.status < 400) {
					list[ActorID].general.push(FileDirInSE+ fileName+String(m));
				} else {
					break;
				}
			}
		};

		MakeOneSpecialForOne = function (ActorID,list, special) {
			if (!special) return;
			if (!list[ActorID]) list[ActorID] = { 'special': [], 'general': [] };
			for (var i in special) {
				var tempList = [];
				MakeOneInfoForOne(ActorID, tempList, special[i].fileName);
				if (tempList[ActorID].general.length>0) {
					list[ActorID].special.push({'condition':special[i].condition,'voiceList':tempList[ActorID].general});
				}
			}
		};

		MakeOneInfo=function(actorId,special,list,general){
			MakeOneInfoForOne(actorId,list,general);
			MakeOneSpecialForOne(actorId,list,special[actorId]);
		};

		for (i = 0; i < ACTOR_NAME.length; i++) {
			if (!ACTOR_NAME[i]) continue;
			MakeOneInfo(i,ACTOR_BATTLE_START_SPECIAL, BC.v_actor_start,ACTOR_NAME[i]+'/'+ BATTLE_START);
			MakeOneInfo(i,ACTOR_BATTLE_END_SPECIAL, BC.v_actor_victory,ACTOR_NAME[i]+'/'+ BATTLE_END);
			MakeOneInfo(i,ACTOR_BATTLE_ESCAPE_SPECIAL, BC.v_actor_escape,ACTOR_NAME[i]+'/'+ BATTLE_ESCAPE);
			MakeOneInfo(i,ACTOR_TURN_ACTIVE_SPECIAL, BC.v_actor_turn,ACTOR_NAME[i]+'/'+ TURN_ACTIVE);
			MakeOneInfo(i,ACTOR_GENERAL_ACTION_SPECIAL, BC.v_actor_default_action,ACTOR_NAME[i]+'/'+ GENERAL_ACTION);
			MakeOneInfo(i,ACTOR_DAMAGE_SPECIAL, BC.v_actor_damage,ACTOR_NAME[i]+'/'+ DAMAGE);
			MakeOneInfo(i,ACTOR_RECOVER_SPECIAL, BC.v_actor_recover,ACTOR_NAME[i]+'/'+ RECOVER);
			MakeOneInfo(i,ACTOR_DEAD_SPECIAL, BC.v_actor_dead,ACTOR_NAME[i]+'/'+ DEAD);
			MakeOneInfo(i,ACTOR_LEVEL_UP_SPECIAL, BC.v_actor_levelup,ACTOR_NAME[i]+'/'+ LEVEL_UP);
			MakeOneInfo(i,ACTOR_SKILL_SPECIAL,BC.v_actor_skill,ACTOR_NAME[i]+'/'+SKILL);
		}

		for (i = 0; i < ENEMY_NAME.length; i++) {
			if (!ENEMY_NAME[i]) continue;
			MakeOneInfo(i,ENEMY_DEFAULT_ACTION_SPECIAL, BC.v_enemy_default_action,ENEMY_NAME[i]+'/'+ GENERAL_ACTION);
			MakeOneInfo(i,ENEMY_DAMAGE_SPECIAL, BC.v_enemy_damage, ENEMY_NAME[i]+'/'+DAMAGE);
			MakeOneInfo(i,ENEMY_RECOVER_SPECIAL, BC.v_enemy_recover, ENEMY_NAME[i]+'/'+RECOVER);
			MakeOneInfo(i,ENEMY_DEAD_SPECIAL, BC.v_enemy_dead,ENEMY_NAME[i]+'/'+ DEAD);
			MakeOneInfo(i,ENEMY_SKILL_SPECIAL,BC.v_enemy_skill,ENEMY_NAME[i]+'/'+SKILL);
		}

		localStorage.setItem('BattleCry_Data', JSON.stringify(BC));
	};

	if(!BC.DataFrom){
		BC.MakeData();
	}else {
		//DataManager.loadDataFile("SF_BattleCry",BC.DataFrom);
		var xhr = new XMLHttpRequest();
    	var url = 'data/' + BC.DataFrom;
    	xhr.open('GET', url);
    	xhr.overrideMimeType('application/json');
    	xhr.onload = function () {
    	    if (xhr.status < 400) {
			   var voice=JSON.parse(xhr.responseText);
			   Object.keys(voice).forEach(function (v) {
				   BC[v]=voice[v];
			   });
    	    }
    	};
    	xhr.onerror = function () {
    	    DataManager._errorUrl = DataManager._errorUrl || url;
    	};
    	xhr.send();
	}

	//=============================================================================
	// ** Sound Manager
	//=============================================================================	

	//==============================
	// * select Voice
	//==============================
	BC.selectVoice = function (voices) {
		if (!voices) { return; }
		console.log(voices);
		var list=[];
		for (var z in voices.special) {
			var func = new Function('"use strict";' + voices.special[z].condition);
			if (func.call(this)) {
				list.concat(voices.special[z].voiceList);
			}
		}
		if(list.length>0){
			voiceIndex = Math.randomInt(list.length);
			fileName = list[voiceIndex];
			SoundManager.playVoice(fileName);
			return true;
		}else if (voices.general.length > 0) {
			voiceIndex = Math.randomInt(voices.general.length);
			fileName = voices.general[voiceIndex];
			SoundManager.playVoice(fileName);
			return true;
		}
		return false;
	};

	//==============================
	// * Play Voice
	//==============================
	SoundManager.playVoice = function (fileName) {
		var se = {};
		se.name = fileName;
		se.pitch = 100;
		se.volume = BC.v_volume;
		AudioManager.playSe(se);
	};

	//=============================================================================
	// ** BattleManager
	//=============================================================================	

	//================================
	// ** Random Actor
	//================================
	BattleManager.randomActor = function () {
		var actorIndex = Math.randomInt($gameParty.aliveMembers().length);
		return $gameParty.aliveMembers()[actorIndex];
	};

	//==================================
	// ** Start Battle
	//==================================
	BC.BattleManager_startBattle = BattleManager.startBattle;
	BattleManager.startBattle = function () {
		BC.BattleManager_startBattle.call(this);
		if (!Imported.MOG_BattleTransitions ||
			(Imported.MOG_BattleTransitions && $gameSystem._treType[1] === -1)) {
			var actor = this.randomActor();
			if (actor) { BC.selectVoice.call(this, actor._v_start); }
		}
	};

	//==================================
	// ** Process Victory
	//==================================
	BC.BattleManager_processVictory = BattleManager.processVictory;
	BattleManager.processVictory = function () {
		if(!BC.processedVictory){
			var actor = this.randomActor();
			if (actor) { BC.selectVoice.call(this, actor._v_victory); }
			BC.processedVictory=true;
		}
		BC.BattleManager_processVictory.call(this);
	};

	//==================================
	// ** Process Escape
	//==================================
	BC.BattleManager_processEscape = BattleManager.processEscape;
	BattleManager.processEscape = function () {
		if(BC.processedEscape){
			var actor = this.randomActor();
			if (actor) { BC.selectVoice.call(this, actor._v_escape); }
			BC.processedEscape=true;
		}
		BC.BattleManager_processEscape.call(this);
	};

	//=============================================================================
	// ** Game Battler
	//=============================================================================

	//==============================
	// * InitMembers
	//==============================
	BC.Game_Battler_initMembers = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function () {
		BC.Game_Battler_initMembers.call(this);
		this.battleCrySetup();
	};

	//==============================
	// * Battle Cry Setup
	//==============================
	Game_Battler.prototype.battleCrySetup = function () {
		this._v_start = { 'special': [], 'general': [] };
		this._v_turn = { 'special': [], 'general': [] };
		this._v_default_action = { 'special': [], 'general': [] };
		this._v_damage = { 'special': [], 'general': [] };
		this._v_evaded = { 'special': [], 'general': [] };
		this._v_counter = { 'special': [], 'general': [] };
		this._v_reflection = { 'special': [], 'general': [] };
		this._v_dead = { 'special': [], 'general': [] };
		this._v_recover = { 'special': [], 'general': [] };
		this._v_escape = { 'special': [], 'general': [] };
		this._v_victory = { 'special': [], 'general': [] };
		this._v_levelup = { 'special': [], 'general': [] };
	};

	//==============================
	// * Battle Cry Setup Actor
	//==============================
	Game_Battler.prototype.battleCrySetupActor = function () {
		if (BC.v_actor_start[this._actorId]) { this._v_start = BC.v_actor_start[this._actorId]; }
		if (BC.v_actor_turn[this._actorId]) { this._v_turn = BC.v_actor_turn[this._actorId]; }
		if (BC.v_actor_default_action[this._actorId]) {
			this._v_default_action = BC.v_actor_default_action[this._actorId];
		}
		if (BC.v_actor_damage[this._actorId]) { this._v_damage = BC.v_actor_damage[this._actorId]; }
		if (BC.v_actor_evaded[this._actorId]) { this._v_evaded = BC.v_actor_evaded[this._actorId]; }
		if (BC.v_actor_counter[this._actorId]) { this._v_counter = BC.v_actor_counter[this._actorId]; }
		if (BC.v_actor_reflection[this._actorId]) { this._v_reflection = BC.v_actor_reflection[this._actorId]; }
		if (BC.v_actor_dead[this._actorId]) { this._v_dead = BC.v_actor_dead[this._actorId]; }
		if (BC.v_actor_recover[this._actorId]) { this._v_recover = BC.v_actor_recover[this._actorId]; }
		if (BC.v_actor_escape[this._actorId]) { this._v_escape = BC.v_actor_escape[this._actorId]; }
		if (BC.v_actor_victory[this._actorId]) { this._v_victory = BC.v_actor_victory[this._actorId]; }
		if (BC.v_actor_levelup[this._actorId]) { this._v_levelup = BC.v_actor_levelup[this._actorId]; }
	};

	//==============================
	// * Battle Cry Setup Enemy
	//==============================
	Game_Battler.prototype.battleCrySetupEnemy = function () {
		if (BC.v_enemy_default_action[this._enemyId]) {
			this._v_default_action = BC.v_enemy_default_action[this._enemyId];
		}
		if (BC.v_enemy_damage[this._enemyId]) { this._v_damage = BC.v_enemy_damage[this._enemyId]; }
		if (BC.v_enemy_evaded[this._enemyId]) { this._v_evaded = BC.v_enemy_evaded[this._enemyId]; }
		if (BC.v_enemy_counter[this._enemyId]) { this._v_counter = BC.v_enemy_counter[this._enemyId]; }
		if (BC.v_enemy_reflection[this._enemyId]) { this._v_reflection = BC.v_enemy_reflection[this._enemyId]; }
		if (BC.v_enemy_dead[this._enemyId]) { this._v_dead = BC.v_enemy_dead[this._enemyId]; }
		if (BC.v_enemy_recover[this._enemyId]) { this._v_recover = BC.v_enemy_recover[this._enemyId]; }
	};

	//===============================
	// ** PerfotmAction
	//===============================
	BC.Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
	Game_Battler.prototype.performActionStart = function (action) {
		if (action) { this.playVoiceAction(action); }
		BC.Game_Battler_performActionStart.call(this, action);
	};

	//===============================
	// ** play Voice Action
	//===============================
	Game_Battler.prototype.playVoiceAction = function (action) {
		var actionID = action.item().id;
		if (this.isActor()) {
			if (action.isSkill() && BC.v_actor_skill[this._actorId]) {
				if (BC.selectVoice.call(this, BC.v_actor_skill[this._actorId])) {return;}
			} else if (action.isItem() && BC.v_actor_item[this._actorId]) {
				if(BC.selectVoice.call(this, BC.v_actor_item[this._actorId])) {return;}
			}
		} else if (this.isEnemy()) {
			if (BC.v_enemy_skill[this._enemyId]) {
				if(BC.selectVoice.call(this, BC.v_enemy_skill[this._enemyId][actionID])) {return;}
			}
		}
		BC.selectVoice.call(this, this._v_default_action);
	};

	//==============================
	// ** perform Counter
	//==============================
	BC.Game_Battler_performCounter = Game_Battler.prototype.performCounter;
	Game_Battler.prototype.performCounter = function () {
		BC.Game_Battler_performCounter.call(this);
		BC.selectVoice.call(this, this._v_counter);
	};

	//==============================
	// ** perform Reflection
	//==============================
	BC.Game_Battler_performReflection = Game_Battler.prototype.performReflection;
	Game_Battler.prototype.performReflection = function () {
		BC.Game_Battler_performReflection.call(this);
		BC.selectVoice.call(this, this._v_reflection);
	};

	//=============================================================================
	// ** Game Actor
	//=============================================================================	

	//==============================
	// * Setup
	//==============================
	BC.Game_Actor_setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function (actorId) {
		BC.Game_Actor_setup.call(this, actorId);
		this.battleCrySetupActor();
	};

	//=============================================================================
	// ** Game Enemy
	//=============================================================================	

	//==============================
	// * Setup
	//==============================
	BC.Game_Enemy_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function (enemyId, x, y) {
		BC.Game_Enemy_setup.call(this, enemyId, x, y);
		this.battleCrySetupEnemy();
	};

	//===============================
	// ** transform
	//===============================
	BC.Game_Enemy_transform = Game_Enemy.prototype.transform;
	Game_Enemy.prototype.transform = function (enemyId) {
		BC.Game_Enemy_transform.call(this, enemyId);
		this.battleCrySetupEnemy();
	};

	//=============================================================================
	// ** Scene Battle
	//=============================================================================	

	//==============================
	// * select Voice
	//==============================
	BC.Scene_Battle_start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function () {
		BC.Scene_Battle_start.call(this);
		this._actorvoice = null;

		BC.processedVictory=false;
		BC.processedEscape=false;
	};

	//==============================
	// * Update Battle Process
	//==============================
	BC.Scene_Battle_updateBattleProcess = Scene_Battle.prototype.updateBattleProcess;
	Scene_Battle.prototype.updateBattleProcess = function () {
		if (this._actorvoice != BattleManager.actor()) { this.playActorTurn(); }
		BC.Scene_Battle_updateBattleProcess.call(this);
	};

	//==============================
	// * Play Actor Turn
	//==============================
	Scene_Battle.prototype.playActorTurn = function () {
		this._actorvoice = BattleManager.actor();
		if (this._actorvoice) {
			if (BC.v_actor_turn[this._actorvoice._actorId]) {
				AudioManager.stopSe();
				BC.selectVoice.call(this,BC.v_actor_turn[this._actorvoice._actorId]);
			}
		}
	};

	//=============================================================================
	// ** Game Action
	//=============================================================================

	//==============================
	// * Apply
	//==============================
	BC.Game_Action_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function (target) {
		var old_hp = target.hp;
		BC.Game_Action_apply.call(this, target);
		if ($gameParty.inBattle()) {
			if (old_hp != target.hp || this.item().damage.type === 3) { this.playVoiceHP(old_hp, target.hp, target); }
			if (target.result().missed || target.result().evaded) { BC.selectVoice.call(this, target._v_evaded); }
		}
	};

	//==============================
	// * Play Voice HP
	//==============================
	Game_Action.prototype.playVoiceHP = function (old_hp, now_hp, target) {
		if (target.isDead()) {
			BC.selectVoice.call(this, target._v_dead);
		} else if (old_hp < now_hp || this.item().damage.type === 3) {
			BC.selectVoice.call(this, target._v_recover);
		} else if (old_hp > now_hp) {
			BC.selectVoice.call(this, target._v_damage);
		}
	};

	//==============================
	// * Item Effect Recover HP
	//==============================
	BC.Game_Action_itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
		var old_hp = target.hp;
		BC.Game_Action_itemEffectRecoverHp.call(this, target, effect);
		if (old_hp <= target.hp) { BC.selectVoice.call(this, target._v_recover); }
	};

	BC.DataManager_extractSaveContents=DataManager.extractSaveContents;
	DataManager.extractSaveContents = function (contents) {
		BC.DataManager_extractSaveContents.call(this,contents);
		$gameActors._data.forEach(function(actor){if(actor) actor.battleCrySetupActor();});
	};

}());