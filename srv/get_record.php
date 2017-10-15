<?php
require "MyPdo.class.php";
$conf = require "config.php";
session_start();
if(!isset($_SESSION["admin"])){
	echo json_encode(back(2,"你未登录"));
	return;
}

$pdo = new MyPdo();
$res = $pdo->selectAll();

// 对数据库相对路径进行处理
foreach($res as $k => $v){
	$res[$k]["url"] = "/".$conf["recordPath"]."/".$res[$k]["url"].".mp3";
}
echo json_encode(["status" => 1, "respond" => $res]);
