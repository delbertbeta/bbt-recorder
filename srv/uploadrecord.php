<?php
 ini_set("display_errors", "On");
 error_reporting(E_ALL | E_STRICT);

 require "MyPdo.class.php";
 require "filtration.php";
 $pdo = new MyPdo();
 // header("Access-Control-Allow-Origin: http://localhost");
 // header("Access-Control-Allow-Credentials: true");
if(!empty($_FILES) && isset($_POST['user'])){
 	$user = json_decode($_POST['user'],true);
 	$record_path = time().rand(100,999);
	$conf = require "config.php";
 	move_uploaded_file($_FILES["recordFile"]["tmp_name"], __DIR__."/".$conf["recordPath"]."/".$record_path);
 	if(keyFiltrate($user)){
 		$respond = array("status"=>"2","message"=>"输入数据含敏感词");
 		echo json_encode($respond);
 		exit;
 	}
	generateQR($record_path,"11");
 	$arr = [
 		"wechat" =>$user['wechat'],
 		"remark" =>$user['remark'],
 		"path"   => $record_path,
		"num"    => $record_path,   //用全数字的文件名作为编号，录音文件名和二维码文件名一样，在不同目录
	];		
 	if($pdo->insert($arr)){
 		$respond = array("status"=>"1");
 	}
 	else $respond = array("status"=>"2","message"=>"数据库出错,无法保存录音");
 	echo json_encode($respond);

}else{
	echo json_encode(["status" => "2","message" => "没有上传文件"]);
}

/**
 * generateQR 
 * 		生成可访问录音链接的二维码
 * @param mixed $recordFileName 录音文件名（无目录）
 * @access public
 * @return void
 */
function generateQR($recordFileName){
 	$conf = require "config.php";
	//处理参数，改为可访问听录音的二维码链接
	$url = $conf["website"]."/getRecord?num=".$recordFileName;
	// 生成二维码图片名称
	$QRFile = $recordFileName.".png";
	require "phpqrcode/phpqrcode.php";
	$errorCorrectionLevel = 'L';//容错级别   
	$matrixPointSize = 6;//生成图片大小   
	//生成二维码图片   
	var_dump($conf["qrcodePath"]."/".$QRFile);
	QRcode::png($url, $conf["qrcodePath"]."/".$QRFile, $errorCorrectionLevel, $matrixPointSize, 2);
}
