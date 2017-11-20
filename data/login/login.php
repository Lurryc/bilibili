<?php
    header('Content-Type: application/json;charset=UTF-8');
    @$uname = $_REQUEST['uname'] or die('{"code":401,"msg":"uname required"}');
    @$upwd = $_REQUEST['upwd'] or die('{"code":402,"msg":"upwd required"}');

    require_once('../init.php');
    $stmt=$conn->prepare("SELECT uid,uname FROM b_user WHERE (uname=? OR phone=?)AND upwd=?");
    $stmt->bind_param('sss',$uname,$uname,$upwd);
    $stmt->execute();
    $result = $stmt->get_result();

    if(!$result){       //SQL语句执行失败
      echo('{"code":500, "msg":"db execute err"');
    }else {
      $row = mysqli_fetch_assoc($result);
      if(!$row){        //用户名或密码错误
        echo('{"code":201, "msg":"uname or upwd err"}');
      }else {           //登录成功
        session_start();
        $_SESSION['loginUname'] = $row['uname'];
        $_SESSION['loginUid'] = $row['uid'];
        echo('{"code":200, "msg":"login succ"}');
      }
    }
?>