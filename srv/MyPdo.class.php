<?php
class MyPdo{
	private $pdo;
	private $db;
	
	function __construct(){
		$config = require "config.php";
		$db = $config["database"];
		$this->db = $db;
		try{
			$this->pdo = new PDO("mysql:host=".$db["hostname"].";dbname=".$db["dbname"],$db["username"],$db["password"]);	
		}catch(PDOException $e){
			echo $e->getMessage();
			return 0;
		}
	}
	 function insert($arr){
		//转义
		foreach ($arr as $value) {
			$value = htmlspecialchars($value);
		}
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("insert into ".$this->db["tablename"]." (`recordWechat`,`recordRemark`,`recordPath`,`recordNum`,`WTime`)values(:wechat,:remark,:path,:num,:time)");
			$statement -> bindParam(":wechat",$arr['wechat']);
			$statement -> bindParam(":remark",$arr['remark']);
			$statement -> bindParam(":path",$arr['path']);
			$statement -> bindParam(":num",$arr['num']);
			$statement -> bindParam(":time",time());
			$statement -> execute();
		}catch(PDOException $e){
			 echo "Error:".$e->getMessage()."<br/>";
			return 0;   //数据库出错
		}
		return 1;
	}
	//找到则返回数组（即使没有数据也是数组）,错误返回null
	function selectAll(){
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("select * from ".$this->db["tablename"]);
			$statement -> execute();
			$respond = $statement -> fetchAll(PDO::FETCH_ASSOC);
			return $respond;
		}catch(PDOException $e){
			echo "Error".$e->getMessage()."<br/>";
			return;
		}
	}
	function delById($id){
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("delete  from ".$this->db["tablename"]." where `id`=:id");
			$statement -> bindParam(":id",$id);
			$statement -> execute();
		}catch(PDOException $e){
			echo "Error".$e->getMessage()."<br/>";
			return 0;
		}
		return 1;
	}
}
	


