<?php
require "MyPdo.class.php";
$conf = require "config.php";
session_start();
if(!isset($_SESSION["admin"]))
	return json_encode(back(1,"你未登录"));

$pdo = new MyPdo();
$res = $pdo->selectAll();

// 对数据库相对路径进行处理
foreach($res as $k => $v){
	$res[$k]["url"] = "/".$conf["recordPath"]."/".$res[$k]["url"].".mp3";
}
return json_encode($res);
