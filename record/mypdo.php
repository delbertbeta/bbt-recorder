<?php
require "config.php";
 class Mypdo{
	private $pdo;
	function __construct(){
		try{
			$this->pdo = new PDO('mysql:host='.USERIP.';dbname='.DBNAME,USERNAME,USERPASS);
		}catch(PDOException $e){
			// echo "Error:".$e->getMessage()."<br>";
			return 0;
		}
	}
	function insert($arr){
		//转义
		foreach ($arr as$value) {
			$value = htmlspecialchars($value);
		}

		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("insert into ".TABLENAME." (`wechat`,`remark`,`s`,`regtime`)values(:wechat,:remark,:url,:regtime)");
			$statement -> bindParam(":wechat",$arr['wechat']);
			$statement -> bindParam(":remark",$arr['remark']);
			$statement -> bindParam(":url",$arr['url']);
			$statement -> bindParam(":regtime",$arr['regtime']);
			$statement -> execute();
		}catch(PDOException $e){
			// echo "Error:".$e->getMessage()."<br/>";
			return 0;   //数据库出错
		}
		return 1;
	}
	//找到则返回数组（即使没有数据也是数组）,错误返回null
	function selectAll(){
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("select * from ".TABLENAME);
			$statement -> execute();
			$respond = $statement -> fetchAll(PDO::FETCH_ASSOC);
			return $respond;
		}catch(PDOException $e){
			// echo "Error".$e->getMessage()."<br/>";
			return;
		}
	}
	function delById($id){
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("delete  from ".TABLENAME." where `id`=:id");
			$statement -> bindParam(":id",$id);
			$statement -> execute();
		}catch(PDOException $e){
			 // echo "Error".$e->getMessage()."<br/>";
			return 0;
		}
		return 1;
	}
}
//  $pdo = new Mypdo();
// // $pdo->insert(array("wechat"=>"1111","remark"=>"remark","url"=>"path","regtime"=>"111"));
// if($pdo->delById(21))
// 	echo "删除成功";
// else
// 	echo "...";

