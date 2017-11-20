<?php
    header("Content-Type:application/json;charset=UTF-8");
    require_once('../init.php');
    $item=$_REQUEST['item'];
    $isLatestNews=$_REQUEST['isLatestNews'];
    $isLatestSub=$_REQUEST['isLatestSub'];
    $sql="select * from b_video where type='$item' and isLatestNews=$isLatestNews and isLatestSub=$isLatestSub order by vid limit 0,8";
    echo json_encode(sql_execute($sql));
?>