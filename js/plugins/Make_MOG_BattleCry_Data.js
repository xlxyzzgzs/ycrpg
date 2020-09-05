//=============================================================================
// Make_MOG_BattleCry_Data.js
/*:
 * @plugindesc 
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * Thanks MOG_BattleCry.js
 * only use for self 
 * 
 * need disable MOG_BattleCry.js
 * require LoadMOG_BattleCry_Data.js
 */
//=============================================================================
(function(){
	
	FileDirInSE='BattleCry/';

	FileVoiceDir='se/'+FileDirInSE;

	FileType=['.m4a']; 
	
	ACTOR_NAME=[];
	ACTOR_NAME[11] = '郝仁';
  	ACTOR_NAME[2]  = '莉莉';
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
	
	ENEMY_NAME=[];
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
	DEFEATED = '死亡';
	
	// 角色升级
	LEVEL_UP = '升级';
	
	
	// 特殊语音部分
	
	//----------------------------------------------------------------------------
	// 非常特殊的语音
	//----------------------------------------------------------------------------
	//南宫五月死亡且南宫三八在战场上
	ACTOR_NANGONG_SPECIAL_DEFEATED = ['南宫三八/特殊语音（五月落败）'];
	//南宫五月治疗自身
	ACTOR_WUYUE_HEAL_SELF = ['南宫五月/特殊语音（治疗自己）'];
	//南宫五月治疗哥哥
	ACTOR_WUYUE_HEAL_SANBA = ['南宫五月/特殊语音（治疗三八）','南宫三八/特殊语音（被五月治疗）'];
	//南宫兄妹在场上且胜利
	ACTOR_NANGONG_WIN = ['南宫三八/特殊语音（胜利且队伍中有五月）','南宫五月/特殊语音（胜利且队伍中有三八）'];
	
	
	// 一般配置的例子如下。
	//
	// ACTOR_SKILL[A] = {  B:['C','C','C'],  B:['C','C','C'],  B:['C','C','C'],}
	//
	// A - 战斗者ID
	// B - 技能ID。
	// C - 声音文件的名称。
	
	//----------------------------------------------------------------------------
	// 使用技能（特殊）
	//----------------------------------------------------------------------------
  
	ACTOR_SKILL_SPECIAL=[];

	ACTOR_SKILL_SPECIAL[11] = {
		1:'攻击',
		91:'特殊技能（挑衅）',
		138:'攻击',
		216:'攻击'
	};
		
	ACTOR_SKILL_SPECIAL[2] = {
		1:'攻击',
		138:'攻击',
		216:'攻击'
	};
		
	ACTOR_SKILL_SPECIAL[13] = {
		1:'攻击',
		138:'攻击',
		216:'攻击',
		132:'特殊技能语音'
	};
		
	ACTOR_SKILL_SPECIAL[18] = {
		1:'攻击',
		138:'攻击',
		170:'特殊技能（海洋赞歌）',
		216:'攻击'
	};
	
	ACTOR_SKILL_SPECIAL[15] = {
		1:'攻击',
		138:'攻击',
		216:'攻击'
	};
		
	ACTOR_SKILL_SPECIAL[27] = {
		1:'攻击',
		138:'攻击',
		216:'攻击'
	};
		
	ACTOR_SKILL_SPECIAL[26] = {
		1:'攻击',
		138:'攻击',
		216:'攻击'
	};
	//----------------------------------------------------------------------------
	// 使用道具（特殊）
	//----------------------------------------------------------------------------

	ACTOR_ITEM_SPECIAL=[] ;
	ACTOR_ITEM_SPECIAL[11] = {
	};
	
	ACTOR_ITEM_SPECIAL[2] = {
	};
	
	ACTOR_ITEM_SPECIAL[13] = {
	};  
	  
	ACTOR_ITEM_SPECIAL[18] = {
	};  

	//----------------------------------------------------------------------------
	// 敌人使用技能（特殊）
	//----------------------------------------------------------------------------
	ENEMY_SKILL_SPECIAL=[];

	ENEMY_SKILL_SPECIAL[31] = {
	138:'攻击',
	132:'特殊技能语音'
	};
	ENEMY_SKILL_SPECIAL[32] = {
	138:'攻击',
	132:'特殊技能语音'
	};      
	
	Moghunter={};
	Moghunter.v_actor_start = [];
	Moghunter.v_actor_turn = [];
	Moghunter.v_actor_default_action = [];
	Moghunter.v_actor_skill = [];
	Moghunter.v_actor_item = [];
	Moghunter.v_actor_damage = [];
	Moghunter.v_actor_evaded = [];
	Moghunter.v_actor_dead = [];
    Moghunter.v_actor_recover = [];
	Moghunter.v_actor_counter = [];
	Moghunter.v_actor_reflection = [];
	Moghunter.v_actor_victory = [];
	Moghunter.v_actor_levelup = [];
	Moghunter.v_actor_escape = [];
	Moghunter.v_enemy_default_action = [];
	Moghunter.v_enemy_damage = [];
	Moghunter.v_enemy_evaded = [];
	Moghunter.v_enemy_counter = [];
	Moghunter.v_enemy_reflection = [];	
	Moghunter.v_enemy_dead = [];
    Moghunter.v_enemy_recover = [];
	Moghunter.v_enemy_skill = [];
	


	Moghunter.v_actor_special_ation=[];

	Moghunter.v_actor_special_ation[18]={
		'condition':'voiceList'
	};
	
	MakeOneInfoForOne=function(ActorID,ActorName,list,name){
		if(!list[ActorID]) list[ActorID]=[];
		for(m=0;;m++){
			xhr =new XMLHttpRequest();
			xhr.open('GET',FileVoiceDir+ActorName+"/"+name+String(m)+'.m4a',false);
			xhr.send();
			if(xhr.status<400){
				list[ActorID].push(FileDirInSE+ActorName+"/"+name+String(m)+'.m4a');
			}else{
				break;
			}
		}
		if(list[ActorID].length==0) {
			list[ActorID]=undefined;
		}
	};

	MakeOneSpecialForOne=function(ActorID,ActorName,list,dict){
		if(!dict) return;
		if(!list[ActorID]) list[ActorID]={};
		for(var i in dict){
			var tempList=[];
			MakeOneInfoForOne(ActorID,ActorName.tempList,dict[i]);
			if(tempList[ActorID]){
				list[ActorID][i]=tempList[ActorID];
			}
		}
		if(list[ActorID]=={}) list[ActorID]=undefined;
	};

	window.MakeData=function(){
		for(i=0;i<ACTOR_NAME.length;i++){
		if(!ACTOR_NAME[i]) continue;
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_start,BATTLE_START);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_victory,BATTLE_END);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_escape,BATTLE_ESCAPE);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_turn,TURN_ACTIVE);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_default_action,GENERAL_ACTION);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_damage,DAMAGE);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_recover,RECOVER);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_dead,DEFEATED);
			MakeOneInfoForOne(i,ACTOR_NAME[i], Moghunter.v_actor_levelup,LEVEL_UP);
			MakeOneSpecialForOne(i,ACTOR_NAME[i], Moghunter.v_actor_skill,ACTOR_SKILL_SPECIAL[i]);
			MakeOneSpecialForOne(i,ACTOR_NAME[i], Moghunter.v_actor_item,ACTOR_ITEM_SPECIAL);
		}

		for(i=0;i<ENEMY_NAME.length;i++){
			if(!ENEMY_NAME[i]) continue;
			MakeOneInfoForOne(i,ENEMY_NAME[i], Moghunter.v_enemy_default_action,GENERAL_ACTION);
			MakeOneInfoForOne(i,ENEMY_NAME[i], Moghunter.v_enemy_damage,DAMAGE);
			MakeOneInfoForOne(i,ENEMY_NAME[i], Moghunter.v_enemy_recover,RECOVER);
			MakeOneInfoForOne(i,ENEMY_NAME[i], Moghunter.v_enemy_dead,DEFEATED);
			MakeOneSpecialForOne(i,ENEMY_NAME[i],Moghunter.v_enemy_skill,ENEMY_SKILL_SPECIAL[i]);

		}
	
		localStorage.setItem('MOG_BattleCry_Data',JSON.stringify(Moghunter));
	};
})();