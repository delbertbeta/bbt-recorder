<?php
	//含敏感词返回1，否则返回0；
	//参数可为数组，也可为字符串
	function keyFiltrate($arr){
	    $keyword = array("alert","script","==1");
		if(is_array($arr)){
			foreach($arr as $value){
				$value = preg_replace('/\s/',"",$value);
				foreach($keyword as $key){
					
					if(preg_match("/$key/i",$value)){
						return 1;
					}
				}
			}
			return 0;
		}else{
			foreach($keyword as $key){
				if(preg_match("/$key/i",$arr)){
					return 1;
				}
				return 0;
			}
		}
	}
?>
