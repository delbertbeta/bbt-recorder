<?php
require "MyPdo.class.php";
$conf = require "config.php";
$json = file_get_contents('php://input');
$input = json_decode($json,true);

if(!isset($input["id"]) || empty($input["id"])){
	header("HTTP/1.1 400 Bad Request");
	return;
}

$pdo = new MyPdo();
$res = $pdo->getQRCodeByIds($input["id"]);

if($res["status"]){
	header("HTTP/1.1 204 No Content");
	return;
}
//下载qrcode文件夹里面的全部文件
$zip=new ZipArchive();
if($zip->open($conf["zipName"], ZipArchive::CREATE)=== TRUE){
	foreach($res["message"] as $k => $v){
		$file = $conf["qrcodePath"]."/".$v.".png";
		if(file_exists($file)){
			$zip->addFile($file);
		}else continue;
	}
	$zip->close(); //关闭处理的zip文件
	header("Cache-Control: public"); 
	header("Content-Description: File Transfer"); 
	header('Content-disposition: attachment; filename='.$conf["zipName"]); //文件名   
	header("Content-Type: application/zip"); //zip格式的   
	header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件    
	header('Content-Length: '. filesize($conf["zipName"])); //告诉浏览器，文件大小   
	@readfile($conf["zipName"]);
}else{
	//返回服务器错误
	header("HTTP/1.1 500 Internal Server Error");
}


	
