<?php 
    //Naming Conventionstactless apples
    //userId = int primaryKey
    //sessionID = int primaryKey
    //timeStamp = 00(day)00(month)0000(Time)
    //logNames = SessionID
    //imageFolders = SessionID
    //imageNames ImageName
    //imageLogEntry sentUserID:TimeStamp|ImageName
    //logentry sentUserID:TimeStamp>messageText

    //Tables
    // 'USERS' Table: user_id primaryKey, user_name String, password String,
    // 'ChatSessions': session_id INT primaryKey, user_id_one INT, user_id_two INT
    //
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);


        $item = $data['somedata']; // Works!
        //$item = $_POST['somedata'];
        echo(json_encode(array("somedata" => $item,'password' => $data['password'], 'username'=>$data['username'])));
         // Works!
    
?>