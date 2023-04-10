<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$SQLServerName = '127.0.1.1:3306';
function getSessionInfo($sessionID, $userID)
{
    $SQLServerName = '127.0.1.1:3306';
    $SQLConnection = null;
    try {
        $SQLConnection = new mysqli($SQLServerName, 'root', null, "ChatApp");
    } catch (Exception $e) {
        die("Connection failed: " . $SQLConnection->connect_error);
    }

    $result = $SQLConnection->query("SELECT user_id_one, user_id_two, session_name FROM chatsessions WHERE session_id = " . $sessionID);
    $SessionData = null;

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $otherUserID = $row['user_id_one'] == $userID ? $row['user_id_two'] : $row['user_id_one'];
            $OtherUsername = $SQLConnection->query("SELECT username FROM user_accounts WHERE account_id=" . $otherUserID)->fetch_assoc()['username'];

            $SessionData = array('session_id' => $sessionID, 'session_name' => $row['session_name'], 'other_user_id' => $otherUserID, 'other_user_name' => $OtherUsername);
        }
    }
    $SQLConnection->close();
    return $SessionData;
}
function createSession($user1, $user2, $sessionName)
{
    $SQLServerName = '127.0.1.1:3306';
    $SQLConnection = null;
    try {
        $SQLConnection = new mysqli($SQLServerName, 'root', null, "ChatApp");
    } catch (Exception $e) {
        die("Connection failed: " . $SQLConnection->connect_error);
    }

    !$SQLConnection->query("INSERT INTO chatsessions(user_id_one,user_id_two,session_name) VALUES ('" . $user1['account_id'] . "','" . $user2['account_id'] . "','" . $sessionName . "')");
    $getSession = $SQLConnection->query("SELECT COUNT(1) FROM chatsessions");
    fopen($getSession . ".txt", "w");
}


$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

//$data = array('requestType' => 'GetSessions', 'account' => array('username' => 'A', 'account_id' => 7, 'sessions' => array('1', '2')));
$SQLConnection;
try {
    $SQLConnection = new mysqli($SQLServerName, 'root', null, "ChatApp");
} catch (Exception $e) {
    die("Connection failed: " . $SQLConnection->connect_error);
}
if ($data != null) {
    if ($data['requestType'] == 'GetSessions') {
        $account = $data['account'];
        $sessions = array();
        foreach ($account['sessions'] as $session_id) {
            $sessions[] = getSessionInfo($session_id, $account['account_id']);
        }
        echo (json_encode(array('account' => $account, 'sessions' => $sessions, 'success' => true)));
    } else if ($data['requestType'] == 'CreateSession') {
        $firstUser = $data['account'];
        try {
            $result = $SQLConnection->query("SELECT account_id, username, password FROM user_accounts WHERE username='" . $data['other_username'] . "'");
            $secondUser = $result->fetch_assoc();

            createSession($firstUser, $secondUser, $data['session_name']);
            echo (json_encode(array('success' => true)));
        } catch (Exception $e) {
            echo (json_encode(array('success' => false, 'err' => 'Name Already Used or Incorrect Username' . $e)));
        }
    } else {
        echo (json_encode(array('success' => false, 'err' => 'Invaild Request Type')));
    }
}
$SQLConnection->close();
