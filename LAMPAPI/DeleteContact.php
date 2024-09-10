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

	// Read in the first name, last name, email, and phone number for contact to be deleted.
    // !!! The user should not have to type these, this info should be passed along via the delete button
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $email = $inData["email"];
    $birthday = $inData["birthday"];
    // !!! Add phone number once phone number column is established
	// $phoneNumber = $inData["PhoneNumber"];

	// Check if the row entry exists
	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE firstName=? AND lastName=? AND email=? AND birthday=?");
	$stmt->bind_param("ssss", $firstName, $lastName, $email, $birthday);
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();

	if (!$row) {
		returnWithError("Contact Does Not Exist");
	}

    // !!! Add phone number to this query
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE firstName=? AND lastName=? AND email=? AND birthday=?");
	// Parameterized SQL queries for ease of use and security.
	$stmt->bind_param("ssss", $firstName, $lastName, $email, $birthday);
	// Execute the query and store the result in $row.
	$stmt->execute();
	$affectedRows = $stmt->affected_rows;

	$stmt->close();
	$conn->close();

	// !!! What happens if unsuccesful?
	if ($affectedRows === 0) {
		returnWithError("Could Not Delete Contact");
	}

	// Found the user, return it to frontend with JSON format.
	returnWithInfo("Succesful Deletion");

    function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson($jsonVal) {
		header('Content-type: application/json');
		echo $jsonVal;
	}

	function returnWithError($err) {
		$jsonVal = sprintf('{"message":"%s"}', $err);
		sendResultInfoAsJson($jsonVal);
		exit;
	}

    function returnWithInfo($message) {
		$jsonVal = sprintf('{"message":"%s"}', $message);
		sendResultInfoAsJson($jsonVal);
	}
?>