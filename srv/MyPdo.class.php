<?php
require "common.php";
class MyPdo{
	private $pdo;
	private $db;
	
	function __construct(){
		$config = require "config.php";
		$db = $config["database"];
		$this->db = $db;
		try{
			//设置数据库编码
			$_opts_values = array(PDO::ATTR_PERSISTENT=>true,PDO::ATTR_ERRMODE=>2,PDO::MYSQL_ATTR_INIT_COMMAND=>'SET NAMES utf8');
			$this->pdo = new PDO("mysql:host=".$db["hostname"].";dbname=".$db["dbname"],$db["username"],$db["password"],$_opts_values);	
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
			$statement = $this->pdo->prepare("select `recordWechat` as 'wechat',`recordRemark` as 'remark',`recordPath` as 'url',`WTime` as 'regtime', `recordId` as 'id' from ".$this->db["tablename"]);
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
			$statement = $this->pdo->prepare("delete  from ".$this->db["tablename"]." where `recordId`=:id");
			$statement -> bindParam(":id",$id);
			$statement -> execute();
			return back(0);
		}catch(PDOException $e){
			return back(1,$e->getMessage());
			return 0;
		}
		return 1;
	}

	/**
	 * getRecordByNum 
	 * 
	 * @param mixed $num 
	 * @access public
	 * @return void
	 */
	function getPathByNum($num){
		try{
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$statement = $this->pdo->prepare("select `recordPath` as 'url',`recordWechat` as 'wechat', `recordRemark` as 'remark'from ".$this->db["tablename"]." where `recordNum` = :num");
			$statement -> bindParam(":num",$num);
			$statement -> execute();
			$respond = $statement -> fetchAll(PDO::FETCH_ASSOC);
			if(empty($respond))
				return back(2,"数据库无记录");
			return back(0,$respond[0]);
		}catch(PDOException $e){
			return back(1,$e->getMessage());	
		}
	}

	/**
	 * getQRCodeByIds 
	 *		获取对应id的二维码路径 
	 * @param mixed $ids id或者id数组 
	 * @access public
	 * @return array 返回数组，0代表数据库操作正确，其他代表错误，message 里面包含信息/数据
	 */
	function getQRCodeByIds($ids){
		//将不是数组的参数转化为数组
		$idArr = [];
		if(!is_array($ids))
			$idArr[] = $ids;
		else $idArr = $ids;

		$in = implode(',',$idArr); 
		try{	
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$statement = $this->pdo->prepare('SELECT * FROM '.$this->db["tablename"].' WHERE `recordId` IN ('.$in.')');
		$statement->execute();
		$respond = $statement -> fetchAll(PDO::FETCH_ASSOC);
		if(empty($respond)){
			return back(1,"找不到id所在的记录");	
		}
		$arr = [];
		foreach($respond as $k => $v){
			$arr[] = $v["recordNum"];
		}
		return back(0,$arr);
		}catch(PDOException $e){
			return back(2,$e->getMessage());
		}




	}
}
	


