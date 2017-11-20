<?php
header("Content-Type:application/json;charset=utf-8");
require_once("../init.php");
$sql="select img,detail,href,dur from b_video where type='promotion' order by vid desc limit 0,4";
$arr=sql_execute($sql);
echo json_encode($arr);