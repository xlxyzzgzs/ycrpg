<?php

	function GetInfo($infoName){
		$array=array();
		$result="";
		if(!isset($_POST[$infoName])||$_POST[$infoName]==""){
			exit("POST info must include ".$infoName);
		}else{
			return $_POST[$infoName];
		}
	}

	try {
		$Action      =GetInfo("Action");
		$GameName    =GetInfo("GameName");
		$GameVersion =GetInfo("GameVersion");
		$UserName    =GetInfo("UserName");
		$PassWord    =GetInfo("Password");
        $SaveName    =GetInfo("key");
        $UserData    =GetInfo("data");
		$Time        =time();
		$array       = array();
		$result      = "";
		
		$db = new PDO('sqlite:rmmv.sqlite');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		header("Access-Control-Allow-Origin: *");

		switch($Action){
            case "GetItem":
                $sql="SELECT * FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				$rows=$select->fetchAll();
				if(count($rows)>0){
					$result=$rows[0]["GameData"];
				}
                break;
            case "SetItem":
                $sql="SELECT * FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				$rows=$select->fetchAll();
				if(count($rows)>0){
					$sql="UPDATE SaveData SET GameData='".$UserData."' WHERE GameName='".$GameName."' AND GameVersion='".$GameVersion."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."'";
				} else {
                    $sql="INSERT INTO SaveData (GameName,GameVersion,UserName,PassWord,SaveName,GameData) VALUES ('".$GameName."','".$GameVersion."','".$UserName."','".$PassWord."','".$SaveName."','".$UserData."')";
                }
                $rows = $db->exec($sql);               
                break;
            case "RemoveItem":
                $sql="DELETE FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."' AND SaveName='".$SaveName."' AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				break;	
			case "GetAllItems":
				$sql="SELECT * FROM SaveData WHERE GameName='".$GameName."' AND UserName='".$UserName."' AND PassWord='".$PassWord."'AND GameVersion ='".$GameVersion."' ";
				$select=$db->query($sql);
				while($rows=$select->fetch()){
					$array[$rows["SaveName"]]=$rows["GameData"];
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