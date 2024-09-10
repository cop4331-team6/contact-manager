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
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $email = $inData["email"];
    $birthday = $inData["birthday"];
    // !!! Add phone number once phone number column is established
	// $phoneNumber = $inData["PhoneNumber"];

	// From JY: Please do not store my password in the database.
	// $password = password_hash($password, PASSWORD_DEFAULT);

    // !!! Add phone number to this query
    // Note that ContactID auto increments, don't need explicitly add
    // INSERT INTO Contacts (firstName, lastName, email, birthday) VALUES (?, ?, ?, ?);
    $stmt = $conn->prepare("INSERT INTO Contacts (firstName, lastName, email, birthday) VALUES (?, ?, ?, ?)");
	// Parameterized SQL queries for ease of use and security.
	$stmt->bind_param("ssss", $firstName, $lastName, $email, $birthday);
	// Execute the query and store the result in $row.
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();
	$conn->close();

	// Empty row.
	if (!$row) {
		returnWithError("Could Not Add Contact");
	}

	// Found the user, return it to frontend with JSON format.
	returnWithInfo($row["ContactID"], $row["firstName"], $row["lastName"], $row["email"], $row["birthday"]);

    function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson($jsonVal) {
		header('Content-type: application/json');
		echo $jsonVal;
	}

	function returnWithError($err) {
		$jsonVal = sprintf('{"ContactID":"","firstName":"","lastName":"","email":"","birthday":"","error":"%s"}', $err);
		sendResultInfoAsJson($jsonVal);
		exit;
	}

    function returnWithInfo($contactID, $firstName, $lastName, $email, $birthday) {
		$jsonVal = sprintf('{"ContactID":"%s","firstName":"%s","lastName":"%s","email":"%s","birthday":"%s","error":""}', $contactID, $firstName, $lastName, $email, $birthday);
		sendResultInfoAsJson($jsonVal);
	}
?>