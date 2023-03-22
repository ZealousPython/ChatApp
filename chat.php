<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
$SQLServerName = '127.0.1.1:3306';
$ip = $_SERVER['SERVER_ADDR'];
function parseChatData($msg)
{
    $msgArray = str_split($msg);
    $outputMsg = array();
    $ignoring = false;
    $valueSlot = 0;
    $currentData = '';
    for ($i = 0; $i < count($msgArray); $i++) {
        if ($ignoring) {
            if ($msgArray[$i] == "'") {
                $ignoring = false;
                continue;
            }
        }
        if (!$ignoring) {
            if ($msgArray[$i] == "'") {
                $ignoring = true;
                continue;
            }

            if ($msgArray[$i] == ',') {
                $valueSlot += 1;
                $outputMsg[] = $currentData;
                $currentData = '';
                continue;
            }
        }
        $currentData = $currentData . $msgArray[$i];
    }
    $outputMsg[] = $currentData;
    return $outputMsg;
}

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);
//$data = array('requestType' => 'sendData', 'session_id' => 1, 'message' => "6,03/15/2023/9:12,'hello worlda'",);
$SQLConnection;

if ($data != null) {

    if ($data['requestType'] == 'retriveData') {
        $messages = array();
        $textFile = fopen(getcwd() . "/StoredFiles/ChatLogs/" . $data['session_id'] . ".txt", "r");
        for ($x = 0; $x < $data['linesRead']; $x++) {
            if (feof($textFile)) break;
            else {
                fgets($textFile);
            }
        }
        for ($x = 0; $x < $data['linesToRead']; $x++) {
            if (feof($textFile)) break;
            else {
                $msgData = parseChatData(fgets($textFile));
                if (isset($msgData[3]) && $msgData[3] != null) {
                    $image = $msgData[3];
                    $imageUri = array('uri' => 'http://' . $ip . "/ChatApp/StoredFiles/ChatLogs/ChatImages/" . $image);
                } else {
                    $imageUri = null;
                }
                $formatedMsg = array("image" => $imageUri, "timeStamp" => $msgData[1], 'message' => $msgData[2], 'id' => $x + $data['linesRead'], 'thisUser' => $msgData[0] == $data['userID']);
                $messages[] = $formatedMsg;
            }
        }
        fclose($textFile);
        echo (json_encode(array('messages' => $messages, 'success' => true)));
    } else if ($data['requestType'] == 'sendData') {
        $newText = $data['message'] . "\n" . file_get_contents(getcwd() . "/StoredFiles/ChatLogs/" . $data['session_id'] . ".txt");
        file_put_contents(getcwd() . "/StoredFiles/ChatLogs/" . $data['session_id'] . ".txt", $newText);
        echo (json_encode(array('success' => true)));
    } else {
        echo (json_encode(array('success' => false, 'dat' => $data)));
    }
}
