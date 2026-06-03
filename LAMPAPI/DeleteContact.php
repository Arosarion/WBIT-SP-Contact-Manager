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
        // Rest of DeleteContact.php logic goes here
        $contactId = $inData["contactId"];
        $userId = $inData["userId"];
        
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
        
        $stmt->bind_param("ii", $contactId, $userId);
        $stmt->execute();
        // Check if any rows were affected
        if($stmt->affective_rows > 0)
        {
            returnWithError("");
        }
        else
        {
            returnWithError("No contact found or deletion failed.");
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
        $retValue = '("error":"' . $err . '")';
        sendResultInfoAsJson($retValue);
    }
