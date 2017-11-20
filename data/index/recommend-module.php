<?php
    require_once("../init.php");
    header("Content-Type:application/json;charset=utf-8");
    $date=$_REQUEST["date"];
    $sql="select * from b_recommend where date='$date' order by rid desc limit 0,6";
    echo json_encode(sql_execute($sql));
?>