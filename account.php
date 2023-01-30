<?php
    $SQLServerName = '127.0.0.1:3306';
    function getSessionIds($account_id){
        $SQLServerName = '127.0.0.1:3306';
        $SQLConnection = new mysqli($SQLServerName,'root',null,"test");
        if ($SQLConnection->connect_error) {
            die("Connection failed: " . $SQLConnection->connect_error);
        }
        $result = $SQLConnection->query("SELECT session_id FROM chatsessions WHERE user_id_one = ".$account_id." OR user_id_two =".$account_id);
    }
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    $SQLConnection = new mysqli($SQLServerName,'root',null,"test");
    if ($SQLConnection->connect_error) {
        die("Connection failed: " . $SQLConnection->connect_error);
      }
      echo "Connected successfully";

    if ($data != null){
        if ($data['requestType'] == 'register'){
            $SQLConnection->query("INSERT INTO logins(username,password) VALUES ('".$data['username']."','".$data['password']."')");
        }
        else if ($data['requestType'] == 'login'){
            $user = [];
            $result = $SQLConnection->query("SELECT account_id, password FROM logins WHERE username='".$data['username']."'");
            $row = $result->fetch_assoc();
            if ($row['password'] == $data['password']){
                $user = ["account_id"=>$row['account_id'],"username"=>$data['username'],'password'=>$data['password'],'sessions'=>array()];

            }
            else{
                throw new Exception("INCORRECT PASSWORD");
            }
        }
    }

?>