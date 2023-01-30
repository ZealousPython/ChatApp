<?php 
    
    $SQLServerName = '127.0.0.1:3306';
    $SQLConnection = new mysqli($SQLServerName,'root',null,"test");
    if ($SQLConnection->connect_error) {
        die("Connection failed: " . $SQLConnection->connect_error);
      }
      echo "Connected successfully";
    $SQLConnection->query("INSERT INTO logins(username,password) VALUES ('hello','world')");
    echo "\nINputted";
    $result = $SQLConnection->query("SELECT * FROM logins");
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
          echo "id: " . $row["account_id"]. " - Name: " . $row["username"]. " " . $row["password"]. "<br>";
        }
      } else {
        echo "0 results";
      }
      
?>