<?php
    $inData = getRequestInfo();
    
    require_once 'config.php';
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $login = $inData["login"];
        $password = $inData["password"];
        // Creates password hash for security
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        //Sends to database
        $stmt = $conn->prepare("INSERT INTO Users (firstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);
        $stmt->execute();

        if ($stmt->affected_rows > 0)
            {
                $userId = $conn->insert_id;
                returnWithInfo($userID, $firstName, $lastName, $login);
            }
            else
            {
                returnWithError("Failed to create user.");
            }
            $stmt->close();
            $conn->close();
    }
    // Helper functions

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
    $retValue = '{"id":0,"firstName":"","lastName":"","login":"","error":"' . $err . '"}';  
    sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($userId, $firstName, $lastName, $login)
    {
        $retValue = '{"id":' . $userId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $login . '"}';
        sendResultInfoAsJson($retValue);
    }
    ?>
