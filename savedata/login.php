<?php
	session_start();

	$DEBUG=1;

	function GetInfo($infoName){
		$array=array();
		$result="";
		if(!isset($_POST[$infoName])||$_POST[$infoName]==""){
			if(!isset($_SESSION[$infoName])||$_SESSION[$infoName]==""){
				$array["code"]="runJs";
				$array["content"]="alert(\"".$infoName." Not Exist!Please Login Firstly!\");location.href=\"/login.html\";";
				//header("location:/login.html");
				$result=json_encode($array);
				die($result);
			}else{
				return $_SESSION[$infoName];
			}
		}else{
			return $_POST[$infoName];
		}
	}
	try {
		$Action      =$_POST["Action"];
		$GameName    =$_POST["GameName"];
		$GameVersion =$_POST["GameVersion"];
		$UserName    =GetInfo("UserName");
		$PassWord    =GetInfo("PassWord");
		$SaveName    =GetInfo("SaveName");
		$UserData    =$_POST["UserData"];
		$Time        =time();
		$array       = array();
		$result      = "";
		switch($Action){
			case "Login":
				$_SESSION["GameName"]=$GameName;
				$_SESSION["GameVersion"]=$GameVersion;
				$_SESSION["UserName"]=$UserName;
				$_SESSION["PassWord"]=$PassWord;
				$_SESSION["SaveName"]=$SaveName;
				$_SESSION["UserData"]=$UserData;
				$array["code"]="succeed";
				$url=
					'/startgame.html?'.
					'GameName='.$GameName.
					'&GameVersion='.$GameVersion;
				$array["content"]=$url;
				header("location:".$url);
				break;
			case "Logout":
				$_SESSION = array();
     			if (isset($_COOKIE[session_name()])) {
        			setcookie(session_name(), '', time()-24*3600, '/');
     			}
				$array["code"]="succeed";
				$url='/login.html';
				$array["content"]=$url;
				header("location:/login.html");
				break;
			case "GetUserInfo":
				if ($GameName!=$_SESSION["GameName"]||$GameVersion!=$_SESSION["GameVersion"]){
					$array["code"]="InfoError";
					$array["content"]="GameName or GameVersion Error!";
				}else{
					$info=array();
					$info["GameName"]=$_SESSION["GameName"];
					$info["GameVersion"]=$_SESSION["GameVersion"];
					$info["UserName"]=$_SESSION["UserName"];
					$info["PassWord"]=$_SESSION["PassWord"];
					$info["SaveName"]=$_SESSION["SaveName"];
					$info["Choice"]=$_SESSION["UserData"];
					if (!$DEBUG){
						unset($_SESSION["SaveName"]);
						unset($_SESSION["UserData"]);
					}
					$array["code"]="Logined";
					$array["content"]=json_encode($info);
				}
				break;
			default:
				$array["code"]="ERROR";
				$url='/login.html';
				$array["content"]=$url;
				header("location:/login.html");
		}
		$result=json_encode($array);
		echo $result;
	}catch(PDOException $e) {
		echo "Exception: ".$e->getMessage();
	}
?>