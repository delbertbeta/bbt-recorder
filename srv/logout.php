<?php
require "common.php";
session_start();
if(!isset($_SESSION["admin"]))
	return json_encode(back("1","你未登录"));
unset($_SESSION["admin"]);
return json_encode(back(0));
session_close();
