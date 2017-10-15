<?php
require "MyPdo.class.php";
$conf = require_once "config.php";
// $json = file_get_contents('php://input');
// $input = json_decode($json,true);
if(!isset($_POST["id"]) || $_POST["id"] == "")
	return json_encode(back(1,"id不能为空"));

$pdo = new MyPdo();

$arr = $pdo->getQRCodeByIds($_POST["id"]);
if($arr["status"] == 0){
	$recordFile = __DIR__."/".$conf["recordPath"]."/".$arr["message"][0].".mp3";
	$qrFile = __DIR__."/".$conf["qrcodePath"]."/".$arr["message"][0].".png";
    // var_dump($recordFile);
	// var_dump($qrFile);
	if(file_exists($recordFile))
		unlink($recordFile);
	if(file_exists($qrFile))
		unlink($qrFile);
}
$res = $pdo->delById($_POST["id"]);

echo json_encode($res);
