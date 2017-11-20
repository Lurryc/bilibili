<?php
header("Content-Type:application/json;charset=utf-8");
require_once("../init.php");
$sql="select img,title,href from b_index_carousel where type='banner' order by cid desc limit 0,5";
$arr=sql_execute($sql);
echo json_encode($arr);