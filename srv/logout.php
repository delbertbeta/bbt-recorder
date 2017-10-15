<?php
require "common.php";
session_start();
if(!isset($_SESSION["admin"])){
	echo json_encode(back("1","你未登录"));
	return;
}
unset($_SESSION["admin"]);
echo json_encode(back(0));
