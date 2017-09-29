<?php  

#设置token
session_start();
$_SESSION['token'] = md5(uniqid(md5(microtime(true)),true));
$_SESSION['token'] .=rand(1, 100000);
echo $_SESSION['token'];

