<?php
 require "mypdo.php";
 require "filtration.php";
 $pdo = new Mypdo();
 // header("Access-Control-Allow-Origin: http://localhost");
 // header("Access-Control-Allow-Credentials: true");
 if(!empty($_FILES)&&isset($_POST['user'])){
 	$user = json_decode($_POST['user'],true);
 	$record_path = time().rand(1000,9999);
 	move_uploaded_file($_FILES["file"]["tmp_name"], __DIR__."\\recordfiles\\".$record_path);

 	if(keyFiltrate($user)){
 		$respond = array("status"=>"2","message"=>"输入数据含敏感词");
 		echo json_encode($respond);
 		exit;
 	}
 	$arr = array(
 		"webchat"=>$user['webchat'],
 		"remark"=>$user['remark'],
 		"record_path"=>$record_path,
 		"uploadtime"=>time());
 	if($pdo->insert($arr)){
 		$respond = array("status"=>"1");
 	}
 	else $respond = array("status"=>"2","message"=>"数据库出错,无法保存录音");
 	echo json_encode($respond);

 }
