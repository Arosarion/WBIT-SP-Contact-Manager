<?php
    $inData = getRequestInfo(); // Get the Json input from the request

    require_once 'config.php'; // Connect to the database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
		// Prepare statment to select user info based on the login. 
        $stmt = $conn->prepare("SELECT ID,firstName,lastName,Password FROM Users WHERE Login=?");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if($row = $result->fetch_assoc())
        {
            if(password_verify($inData["password"], $row['Password']))
            {
                returnWithInfo($row['firstName'], $row['lastName'], $row['ID']); // If successful, return user's info.
            }
            else
            {
                returnWithError("No Records Found"); // If the password is incorrect, return an error
            }
        }
        else
        {
            returnWithError("No Records Found"); // If no match is found, return an error
        }
        $stmt->close();
        $conn->close();
    }

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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>