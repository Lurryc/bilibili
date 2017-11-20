<?php
header("Content-Type:application/json;charset=utf-8");
require_once("../init.php");
$type=$_REQUEST['type'];
if($type=='bangumi'){
    $count=10;
}else{
    $count=7;
}
$sql1="select * from b_rank where type='$type' order by point desc limit 0,$count";
$sql2="select * from b_rank where type='$type' and isOrigin=true order by point desc limit 0,$count";
$arr[0]=sql_execute($sql1);
$arr[1]=sql_execute($sql2);
echo json_encode($arr);