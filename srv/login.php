<?php
require "common.php";
// $json = file_get_contents('php://input');
// $input = json_decode($json,true);
//验证后台管理账号密码
if(!isset($_POST["username"]) || !isset($_POST["password"]) || empty($_POST["username"]) || empty($_POST["password"])){
	echo json_encode(back(1,"缺少用户名密码"));
	return;
}
$conf = require "config.php";
if($_POST["username"] != $conf["username"] || $_POST["password"] != $conf["password"]){
	echo json_encode(back(2,"用户名密码错误"));
	return;
}

//启用session
session_start();
$_SESSION["admin"] = 1;
echo json_encode(back(0,"成功登录"));
return;



