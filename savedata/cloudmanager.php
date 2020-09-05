<?php
	session_start();
	function GetInfo($infoName){
		$array=array();
		$result="";
		if(!isset($_POST[$infoName])||$_POST[$infoName]==""){
			if(!isset($_SESSION[$infoName])||$_SESSION[$infoName]==""){
				$array["code"]="runJs";
				$array["content"]="alert(\"".$infoName." Not Set!\nPlease Login Firstly!\");location.href=\"/login.html\";";
				$result=json_encode($array);
				header("location:/login.html");
				die($result);
			}else{
				return $_SESSION[$infoName];
			}
		}else{
			return $_POST[$infoName];
		}
	}
	
	try {
		$Action      =GetInfo("Action");
		$GameName    =$_POST["GameName"];
		$GameVersion =$_POST["GameVersion"];
		$UserName    =$_POST["UserName"];
		$PassWord    =$_POST["Password"];
		$SaveName    =$_POST["SaveName"];
		$UserData    =$_POST["UserData"];
		$Time        =time();
		$array       = array();
		$result      = "";
		
		$db = new PDO('sqlite:rmmv.sqlite');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		switch($Action){
			case "SaveGame" :
				$sql="UPDATE SaveData SET GameData='".$UserData."' WHERE GameName='".$GameName."' AND GameVersion='".$GameVersion."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."'";
				$rows = $db->exec($sql);
				$result = $rows." games saved";
				break;
			case "CheckSave" :
				switch($UserData){
					case "continue":
						$sql= "SELECT GameVersion FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' ";
						$select = $db->query($sql);
						$rows = $select->fetchAll();
						if (count($rows)>0){
							if ($rows[0]["GameVersion"]!==$GameVersion){
								$array["code"]="hidden";
								$array["content"]="存档版本过低，请选择较新版本或选择开始新游戏！";
							}
							else {
								$array["code"]="show";
								$array["content"]="当前存档可用，可以读取存档！";
							}
						}else{
							$array["code"]="hidden";
							$array["content"]="存档不存在，请选择开始新游戏！";
						}
						break;
					case "newgame":
						$sql= "SELECT GameVersion FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' ";
						$select = $db->query($sql);
						$rows = $select->fetchAll();
						if (count($rows)>0){
							if ($rows[0]["GameVersion"]!==$GameVersion){
								$array["code"]="show";
								$array["content"]="请注意旧版本存档即将被覆盖！";
							}else {
								$array["code"]="show";
								$array["content"]="当前存档可用，确定重新开始？";
							}
						}else{
							$array["code"]="show";
							$array["content"]="存档不存在，可以开始新游戏！";
						}
						break;
					case "autosaved":
						$sql= "SELECT GameVersion FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='AutoSaved'";
						$select = $db->query($sql);
						$rows = $select->fetchAll();
						if (count($rows)>0){
							if ($rows[0]["GameVersion"]!==$GameVersion){
								$array["code"]="hidden";
								$array["content"]="自动存档无效，请重新输入！";
							}else {
								$array["code"]="show";
								$array["content"]="当前存档可用，确定从自动保存处继续？";
								$sql= "SELECT GameVersion FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='AutoSaved'";
								$select = $db->query($sql);
								$rows = $select->fetchAll();
								if (count($rows)>0){
								$array["content"]=$array["content"]."请注意旧版本存档即将被覆盖！并注意及时存档";
								}
							}
						}else{
							$array["code"]="hidden";
							$array["content"]="存档不存在，无法从自动保存处继续！";
						}
						break;
					default:
						$array["code"]="hidden";
						$array["content"]="有未知的错误发生！请联系管理员或重试";
				}
				$array["content"]=$array["content"]."<br/>注意无论选择什么自动存档均会被覆盖！";
				$result = json_encode($array);
				break;
			case "LoadGame":
				$sql="SELECT * FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				$rows=$select->fetchAll();
				if(count($rows)>0){
					$array["code"]="LoadGame";
					$array["content"]=$rows[0]["GameData"];
				}else {
					$array["code"]="ReLogin";
					$array["content"]="发生了某些未知问题，请联系管理员。";
				}
				$result = json_encode($array);
				break;
			case "CheckForDB":
				$sql="SELECT * FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				$rows=$select->fetchAll();
				if(count($rows)===0){
					$result=$SaveName."不存在，准备添加！";
					$sql="INSERT INTO SaveData (GameName,GameVersion,UserName,PassWord,SaveName,GameData) VALUES ('".$GameName."','".$GameVersion."','".$UserName."','".$PassWord."','".$SaveName."','".$UserData."')";
					$rows = $db->exec($sql);
					$result = $result.$rows." added";
				}
				break;
			case "GetSaveFileList":
				$sql="SELECT SaveName FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				$_SaveName=array();
				while($rows=$select->fetch()){
					if ($rows["SaveName"]==="AutoSaved" || $rows["SaveName"]==="ConfigSaved"){
						continue;
					}
					array_push($_SaveName,$rows["SaveName"]);
				}
				if(count($_SaveName)>0){
					$array["code"]="exists";
					$array["content"]=$_SaveName;
				}else{
					$array["code"]="none";
					$array["content"]="没有发现存档文件！";
				}
				$result=json_encode($array);
				break;
			
			default:
				$result="无效的操作";
		}
		$db = NULL;
		echo $result;
	}catch(PDOException $e) {
		echo "Exception: ".$e->getMessage();
	}
?>