<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    $SQLServerName = '127.0.1.1:3306';
    function getSessionIds($account_id){
        $Sessions = array();
        $SQLServerName = '127.0.1.1:3306';
        $SQLConnection = new mysqli($SQLServerName,'root',null,"ChatApp");
        if ($SQLConnection->connect_error) {
            die("Connection failed: " . $SQLConnection->connect_error);
        }
        $result = $SQLConnection->query("SELECT session_id FROM chatsessions WHERE user_id_one = ".$account_id." OR user_id_two =".$account_id);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
              $Sessions[] = $row['session_id'];
            }
        }
        $SQLConnection->close();
        return $Sessions;
        
    }
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);
    
    //$data = array('requestType'=>'register', 'username'=>'hello','password'=>'world');
    $SQLConnection;
    try{
        $SQLConnection= new mysqli($SQLServerName,'root',null,"ChatApp");
    }
    catch (Exception $e){
        die("Connection failed: " . $SQLConnection->connect_error);
    }

    if ($data != null){
        if ($data['requestType'] == 'register'){
            
            
            try{
               !$SQLConnection->query("INSERT INTO user_accounts(username,password) VALUES ('".$data['username']."','".$data['password']."')");
            }
            catch (Exception $e){
                echo(json_encode(array('err'=>"*Username is in use",'success'=> false)));
                $SQLConnection->close();
                exit();
            }
            $result = $SQLConnection->query("SELECT account_id FROM user_accounts WHERE username='".$data['username']."'");
            $row = $result->fetch_assoc();
            $user = ["account_id"=>$row['account_id'],"username"=>$data['username'],'sessions'=>array()];
            $user['sessions'] = getSessionIds($user['account_id']);
            echo(json_encode(array('account'=>$user,'success'=> true)));
        }
        else if ($data['requestType'] == 'login'){
            $user = [];
            $result = $SQLConnection->query("SELECT account_id, password FROM user_accounts WHERE username='".$data['username']."'");
            $row = $result->fetch_assoc();
            if ($row['password'] == $data['password']){
                $user = ["account_id"=>$row['account_id'],"username"=>$data['username'],'sessions'=>array()];
                $user['sessions'] = getSessionIds($user['account_id']);
                echo(json_encode(array('account'=>$user,'success'=> true)));
            }
            else{
                echo(json_encode(array('err'=>"*Incorrect Password",'success'=> false)));
            }
        }
    }
    $SQLConnection->close();
