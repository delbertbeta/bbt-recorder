<?php
require "MyPdo.class.php";
$json = file_get_contents('php://input');
$input = json_decode($json,true);

if(!isset($input["id"]) || $input["id"] == "")
	return json_encode(back(1,"id不能为空"));

$pdo = new MyPdo();

$res = $pdo->delById($input["id"]);
var_dump($res);
return json_encode($res);

