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
    }