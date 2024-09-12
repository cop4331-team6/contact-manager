<?php
    // QW
	// Get the JSON payload sent from code.js
    $inData = getRequestInfo();

	// From JY: Get private database credentials.
    require "DatabaseConfig.php";

	// Connect to database with the credentials.
	$conn = new mysqli("localhost", $dbUsername, $dbPassword, "contactManager");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	}

	// Read in the first name, last name, email, and phone number for new contact.
	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
    $birthday = $inData["birthday"];
	
	// From JY: Please do not store my password in the database.
	// $password = password_hash($password, PASSWORD_DEFAULT);

    // Note that ContactID auto increments, don't need explicitly add
    $stmt = $conn->prepare("INSERT INTO Contacts (firstName, lastName, email, phoneNumber, birthday) VALUES (?, ?, ?, ?, ?)");
	// Parameterized SQL queries for ease of use and security.
	$stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $birthday);
	// Execute the query and store the result in $row.
	$stmt->execute();
	// $row = $stmt->get_result()->fetch_assoc();
	$affectedRows = $stmt->affected_rows;
	$stmt->close();

	
	// if (!$row) {
	// 	returnWithError("Could Not Add Contact");
	// }

	if ($affectedRows === 0) {
		returnWithError("Could Not Add Contact");
	}

	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE firstName=? AND lastName=? AND email=? AND phoneNumber=? AND birthday=?");
	$stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $birthday);
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();

	$contactID = $row["ContactID"];

	$stmt = $conn->prepare("INSERT INTO Connections (UserID, ContactID) VALUES (?, ?)");
	$stmt->bind_param("ss", $userId, $contactID);
	$stmt->execute();
	$affectedRows = $stmt->affected_rows;
	$stmt->close();

	if ($affectedRows === 0) {
		returnWithError("Could Not Add Connection");
	}


	$conn->close();

	// Found the user, return it to frontend with JSON format.
	returnWithInfo($row["ContactID"], $row["firstName"], $row["lastName"], $row["email"], $row["phoneNumber"], $row["birthday"]);

    function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson($jsonVal) {
		header('Content-type: application/json');
		echo $jsonVal;
	}

	function returnWithError($err) {
		$jsonVal = sprintf('{"ContactID":"","firstName":"","lastName":"","email":"","phoneNumber":"","birthday":"","error":"%s"}', $err);
		sendResultInfoAsJson($jsonVal);
		exit;
	}

    function returnWithInfo($contactID, $firstName, $lastName, $email, $phoneNumber, $birthday) {
		$jsonVal = sprintf('{"ContactID":"%s","firstName":"%s","lastName":"%s","email":"%s","phoneNumber":"%s","birthday":"%s","error":""}', $contactID, $firstName, $lastName, $email, $phoneNumber, $birthday);
		sendResultInfoAsJson($jsonVal);
	}
?>