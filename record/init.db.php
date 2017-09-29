<?php
	//读入配置文件
	include "config.php";

	//连接数据库
	$con=mysqli_connect(USERIP,USERNAME,USERPASS);
	if(!$con)
		die("DB连接失败");

	//创建表
	$CreateDB="create database if not exists `".DBNAME."` character set ".CODE;
	$res=mysqli_query($con,$CreateDB);
	if(!$res)
		die("创建数据库失败");

	//进入数据库
	mysqli_select_db($con,DBNAME);

	//创建表
	$CreateTable="CREATE TABLE if not exists ".TABLENAME." (
		  `id` int(11) NOT NULL,
		  `webchat` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
		  `remark` text COLLATE utf8_unicode_ci COMMENT '备注',
		  `record_path` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '相对路径（文件名）上传时间+一个随机数',
		  `uploadtime` int(11) NOT NULL COMMENT '发表时间/上传'
		) ENGINE=MyISAM DEFAULT CHARSET=".CODE." COLLATE=utf8_unicode_ci";
	$res=mysqli_query($con,$CreateTable);
	if(!$res)
	{
		die("创建表失败");
	}

?>