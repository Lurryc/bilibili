<?php
    header("Content-Type:application/json;charset=utf-8");
    require("../init.php");
    $week=$_REQUEST['week'];
    $sql="select * from b_bangumi_video where on_time='$week' order by vid desc";
    $arr=sql_execute($sql);
    echo json_encode($arr);
?>