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

    $stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
	// Parameterized SQL queries for ease of use and security.
	$stmt->bind_param("s", $username);
	// Execute the query and store the result in $row.
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();

	// Username already exists, cannot make an user with given username.
	if ($row) {
        $conn->close();
		returnWithError(sprintf("Username '%s' already exists.", $username));
	}

    // We are safe to create this user.
    $stmt = $conn->prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $affectedRows = $stmt->affected_rows;
    $stmt->close();

    // For whatever reason, the user was NOT created.
    if ($affectedRows == 0) {
        $conn->close();
        returnWithError("Could not create user due to server error.");
    }

    // Return the user just like Login.php.
    $stmt = $conn->prepare("SELECT UserID, Username, Password FROM Users WHERE Username=? AND Password=?");
	$stmt->bind_param("ss", $username, $password);
	// Execute the query and store the result in $row.
	$stmt->execute();
	$row = $stmt->get_result()->fetch_assoc();
	$stmt->close();
	$conn->close();

    // For whatever reason, the user was NOT created/found.
	if (!$row) {
		returnWithError("No records found.");
	}

	// Found the created user, return it to frontend with JSON format.
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