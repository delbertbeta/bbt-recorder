<?php
require "common.php";
$json = file_get_contents('php://input');
$input = json_decode($json,true);
//验证后台管理账号密码
if(!isset($input["username"]) || !isset($input["password"]) || empty($input["username"]) || empty($input["password"]))
	return json_encode(back(1,"缺少用户名密码"));
$conf = require "config.php";
if($input["username"] != $conf["username"] || $input["password"] != $conf["password"])
	return json_encode(back(2,"用户名密码错误"));

//启用session
session_start();
$_SESSION["admin"] = 1;
return json_encode(back(0,""));
session_close();



