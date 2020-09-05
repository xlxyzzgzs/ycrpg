ServerCheckFileLoc="./savedata/cloudmanager.php";
ServerGetFileListLoc="./savedata/cloudmanager.php";
ServerLoginLoc="./savedata/login.php";
document.getElementById("input").setAttribute("action",ServerLoginLoc);


checkInput=function(){
	var _gameName=document.getElementById("game_name").value;
	var _gameVersion=document.getElementById("game_version").value;
	var _userName=document.getElementById("user_name").value;
	var _userPassword=document.getElementById("user_password").value;
	var _userSavename=document.getElementById("user_savename").value;
	var _choiceObj=document.getElementById("user_chioce");
	var _index=_choiceObj.selectedIndex;
	var _choice=_choiceObj.options[_index].value;
	
	document.getElementById("result").innerHTML="";
	if (_userSavename==="AutoSaved" || !(_gameName&&_gameVersion&&_userName&&_userPassword&&_userSavename&&_choice)){
		document.getElementById("result").innerHTML="输入存在无效项，请检查输入！";
		return;
	}
	
	var data= 
		"Action="+encodeURIComponent("CheckSave")+
		"&GameName="+encodeURIComponent(_gameName)+
		"&GameVersion="+encodeURIComponent(_gameVersion)+
		"&UserName="+encodeURIComponent(_userName)+
		"&Password="+encodeURIComponent(_userPassword)+
		"&SaveName="+encodeURIComponent(_userSavename)+
		"&UserData="+encodeURIComponent(_choice);
				
	var xhr = new XMLHttpRequest();
	xhr.open("post",ServerCheckFileLoc,false);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
	result=JSON.parse(xhr.responseText);
	switch(result["code"]){
		case "runJs":
			eval(result["content"]);
			return;
		case "show":
			document.getElementById("start").removeAttribute("hidden");
			break;
	}
	document.getElementById("result").innerHTML=result["content"];
	
};
			
inputChanged=function(){
	document.getElementById("start").setAttribute("hidden","hidden");
	if (document.getElementById("SaveList")){
		document.getElementById("SaveList").remove();
	}
}

/*
selectChange=function(){
	document.getElementById("getSaveList").setAttribute("disabled","disabled");
	var _choiceObj=document.getElementById("user_chioce");
	var _index=_choiceObj.selectedIndex;
	var _choice=_choiceObj.options[_index].value;
	if (_choice==="")
};
*/
getSaveFileList=function(){
	var _gameName=document.getElementById("game_name").value;
	var _gameVersion=document.getElementById("game_version").value;
	var _userName=document.getElementById("user_name").value;
	var _userPassword=document.getElementById("user_password").value;
	var _userSavename=document.getElementById("user_savename").value;
	var _choiceObj=document.getElementById("user_chioce");
	var _index=_choiceObj.selectedIndex;
	var _choice=_choiceObj.options[_index].value;
	
	document.getElementById("result").innerHTML="";
	if (_userSavename==="AutoSaved" || !(_gameName&&_gameVersion&&_userName&&_userPassword&&_choice)){
		document.getElementById("result").innerHTML="输入存在无效项，请重新输入！";
		return;
	}
	
	var data= 
		"Action="+encodeURIComponent("GetSaveFileList")+
		"&GameName="+encodeURIComponent(_gameName)+
		"&GameVersion="+encodeURIComponent(_gameVersion)+
		"&UserName="+encodeURIComponent(_userName)+
		"&Password="+encodeURIComponent(_userPassword)+
		"&SaveName="+encodeURIComponent(_userSavename)+
		"&UserData="+encodeURIComponent(_choice);
				
	var xhr = new XMLHttpRequest();
	xhr.open("post",ServerGetFileListLoc,false);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(data);
	result=JSON.parse(xhr.responseText);
	switch(result["code"]){
		case "exists":
			if (document.getElementById("SaveList")){
				document.getElementById("SaveList").remove();
			}
			var dataList=document.createElement("datalist");
			dataList.setAttribute("id","SaveList");
			for(var i=0;i<result["content"].length;i++){
				opt=document.createElement("option");
				opt.setAttribute("value",result["content"][i]);
				opt.setAttribute("class","dataOption");
				dataList.appendChild(opt);
			}
			document.getElementById("saveFile").appendChild(dataList)
			break;
		case "runJs":
			eval(result["content"]);
			return ;
			
	}
	document.getElementById("result").innerHTML=result["content"];
}

//document.getElementById("input").oninput(inputChanged());

window.addEventListener("beforeunload",reLogin);
document.getElementById("user_chioce").addEventListener("change",inputChanged);
//document.getElementById("user_chioce").addEventListener("change",selectChange);
document.getElementById("input").addEventListener("keydown",inputChanged);

window.onbeforeunload = function (e) {
  e = e || window.event;

  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示';
  }

  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示';
};