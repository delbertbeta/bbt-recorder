<?php
//验证用户密码
if(!isset($_GET["username"]) || !isset($_GET["password"]) || empty($_GET["username"]) || empty($_GET["password"]))
	return json_decode(back(1,"缺少用户名密码"));
$conf = require "config.php";
if($_GET["username"] != $conf["username"] || $_GET["password"] != $conf["password"])
	return json_decode(back(2,"用户名密码错误"));

//递归压缩文件夹
function addFileToZip($path,$zip){
	  $handler=opendir($path); //打开当前文件夹由$path指定。
	  while(($filename=readdir($handler))!==false){
		  if($filename != "." && $filename != ".."){
			  //文件夹文件名字为'.'和‘..'，不要对他们进行操作
			  if(is_dir($path."/".$filename)){
				  // 如果读取的某个对象是文件夹，则递归
			      addFileToZip($path."/".$filename, $zip);
			  }else{ 
				  //将文件加入zip对象
			      $zip->addFile($path."/".$filename);
			  }
		  }
	  }
	  @closedir($path);
}
 
//下载qrcode文件夹里面的全部文件
$zip=new ZipArchive();
if($zip->open($conf["zipName"], ZipArchive::CREATE)=== TRUE){
	  addFileToZip($conf["qrcodePath"]."/", $zip); //调用方法，对要打包的根目录进行操作，并将ZipArchive的对象传递给方法
	  $zip->close(); //关闭处理的zip文件
	  header("Cache-Control: public"); 
	  header("Content-Description: File Transfer"); 
	  header('Content-disposition: attachment; filename='.$conf["zipName"]); //文件名   
	  header("Content-Type: application/zip"); //zip格式的   
	  header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件    
	  header('Content-Length: '. filesize($conf["zipName"])); //告诉浏览器，文件大小   
	  @readfile($conf["zipName"]);
}else{
	//如何处理，返回错误页面？
	return json(["status" =>2,"msg" => "下载出错，zip文件出错"]);
}




