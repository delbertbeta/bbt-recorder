<?php
if(!isset($_GET["num"]) || empty($_GET["num"]))
	return json_decode(back(1,"缺少编号"));
//下载录音文件（num.mp3)

