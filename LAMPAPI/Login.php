<?php
// Decode user's json request payload.
	$inData = getRequestInfo();
	// Get private database credentials.
	require "DatabaseConfig.php";
	// Connect to database with the credentials.
	$conn = new mysqli("localhost", $dbUsername, $dbPassword, "contactManager");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	}
	
	// Read in user's inputted Username and password.
	$username = $inData["Username"];
	$password = $inData["Password"];

	// Please do not store my password in the database.
	// $password = password_hash($password, PASSWORD_DEFAULT);

	$stmt = $conn->prepare("SELECT UserID, Username, Password FROM Users WHERE Username=? AND Password=?");
	// Parameterized SQL queries for ease of use and security.
	$stmt->bind_param("ss", $username, $password);
	// Execute the query and store the result in $row.
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();
	$conn->close();

	// Empty row.
	if (!$row) {
		returnWithError("No records found.");
	}

	// Found the user, return it to frontend with JSON format.
	returnWithInfo($row["UserID"], $row["Username"], $row["Password"]);

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function sendResultInfoAsJson($jsonVal) {
		header('Content-type: application/json');
		echo $jsonVal;
	}

	function returnWithError($err) {
		$jsonVal = sprintf('{"UserID":"","Username":"","Password":"","error":"%s"}', $err);
		sendResultInfoAsJson($jsonVal);
		exit;
	}

	function returnWithInfo($id, $username, $password) {
		$jsonVal = sprintf('{"UserID":"%s","Username":"%s","Password":"%s","error":""}', $id, $username, $password);
		sendResultInfoAsJson($jsonVal);
	}
?>