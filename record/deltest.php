<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<div><input type="button" id="test">
	<script type="text/javascript" src="jquery-3.2.0.min.js"></script>
	<script type="text/javascript">
	$("#test").click(function(){
		var data1 = {
			login:"",
			username:"root",
			password:"root"
		};
		// data=JSON.stringify(data);
		$.ajax({
			url:"index.php",
			type:"POST",
			data:data1,
			success:function(data){
				console.log(JSON.parse(data));
			}
		})
		var data = {
			logout:"",
		};
		// data=JSON.stringify(data);
		$.ajax({
			url:"index.php",
			type:"GET",
			data:data,
			success:function(data){
				console.log(JSON.parse(data));
			}
		})

	})
	</script>
</body>
</html>