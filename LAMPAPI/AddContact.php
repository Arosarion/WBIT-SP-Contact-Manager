<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	// Connect to the database
	require_once 'config.php'; 
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); 
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Add new contact into the database
		$stmt = $conn->prepare("INSERT INTO Contacts (userID, firstName, lastName, email, phone) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("issss", $userId, $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
		$stmt->execute();
		$contactId = $stmt->insert_id;
		$stmt->close();
		$conn->close();
	 	
        returnWithInfo($contactId, $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
    }
	// Get Json input from the request
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	// Send Json reponse
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	// Return error, empty Json array
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	// Return contact info as Json 
	function returnWithInfo( $id, $firstName, $lastName, $email, $phone) 
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phone":"' . $phone . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>