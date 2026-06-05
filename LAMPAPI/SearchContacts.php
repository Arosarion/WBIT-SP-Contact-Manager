<?php

	$inData = getRequestInfo(); // Get the Json input from the request
	
	$searchResults = "";
	$searchCount = 0;

	require_once 'config.php'; // Connect to the database
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Search using partial match.
		$stmt = $conn->prepare("SELECT contactID, firstName, lastName, email, phone FROM Contacts WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?) AND userID=?");
		$searchTerm = "%" . $inData["search"] . "%"; // Add wildcards for partial matching
		$stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();// Get result, comes from the front end
		
		// Loop through results and build Json array to return
		while($row = $result->fetch_assoc()) 
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// Build Json array of search results
			$searchResults .= '{"id":' . $row["contactID"] . ',"firstName":"' . $row["firstName"] . '","lastName":"' . $row["lastName"] . '","email":"' . $row["email"] . '","phone":"' . $row["phone"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" ); // array is empty, return error
		}
		else
		{
			returnWithInfo( $searchResults ); // Return search results as Json array
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	// Return search results as Json Array
	function returnWithInfo( $searchResults ) 
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>