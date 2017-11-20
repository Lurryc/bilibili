<?php
    header('Content-Type:application/json;charset=utf-8');
    require_once('../init.php');
    $uname = $_REQUEST['uname'] or die('{"code":401,"msg":"uname required"}');
    $upwd = $_REQUEST['upwd'] or die('{"code":402,"msg":"upwd required"}');
    $phone = $_REQUEST['tel'] or die('{"code":404,"msg":"phone required"}');

    $sql = "INSERT INTO b_user(uname,upwd,phone) VALUES('$uname','$upwd','$phone')";
    $result = mysqli_query($conn,$sql);

//    $sql = "INSERT INTO b_user(uname,upwd,phone) VALUES(?,?,?)";
//    $stmt = $conn->prepare($sql);
//    $stmt->bind_param("sss",$uname,$upwd,$phone);
//    $stmt->execute();
//    $result = $stmt->get_result();

    if(!$result){
      echo('{"code":500, "msg":"db execute err","sql":'.$sql.'}');
    }else {
      $uid = mysqli_insert_id($conn);
      session_start();
      $_SESSION['loginUname']=$uname;
      $_SESSION['loginUid']=$uid;
      echo('{"code":200, "msg":"register succ", "uid":'.$uid.'}');
    }
?>