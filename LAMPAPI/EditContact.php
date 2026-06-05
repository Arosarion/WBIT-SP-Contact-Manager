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
        // Rest of EditContact.php logic goes here
        $contactId = $inData["contactId"];
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $email = $inData["email"];
        $phone = $inData["phone"];
        $userId = $inData["userId"];

        $stmt  = $conn->prepare("UPDATE Contacts SET firstName=?, lastName=?, email=?, phone=? WHERE contactID=? AND userID=?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactId, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithInfo("Contact updated successfully");
        } else {
            returnWithError("No contact found with the provided contactID and userID, or no changes were made.");
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

   function returnWithInfo($message)
    {
        $retValue = '{"message":"' . $message . '","error":""}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
        
