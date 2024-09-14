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

    // TODO: Make sure that someone can't just claim that they are some UserID. Someone shouldn't be able to claim they are UserID = 6 and get all of 6's contacts.
    // TODO: Saw something in php that handles sessions.
    // TODO: Or just store the password in the cookie (maybe hash it first and do some funny business) and send the password every Contact api call.

    $UserID = $inData["UserID"];
    $ContactID = $inData["ContactID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];
    $birthday = $inData["birthday"];

    // Make sure that the Contact the user wishes to update exists AND belongs to them.
    $stmt = $conn->prepare("SELECT Contacts.* FROM Contacts " .
                            "LEFT JOIN Connections ON Contacts.ContactID = Connections.ContactID " .
                            "WHERE Connections.UserID = ? AND Contacts.ContactID = ?");
    // Parameterized SQL queries for ease of use and security.
    $stmt->bind_param("ss", $UserID, $ContactID);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    // Well, looks like no such record exists.
    if (!$row) {
        $conn->close();
        returnWithError("Contact Does Not Exist");
    }

    // We can safely update this Contact without checking anything else.
    $stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, birthday = ? WHERE ContactID = ?");
    $stmt->bind_param("ssssss", $firstName, $lastName, $email, $phoneNumber, $birthday, $ContactID);
    $stmt->execute();
    $stmt->close();

    // We can return the updated Contact.
    $stmt = $conn->prepare("SELECT ContactID, firstName, lastName, email, phoneNumber, birthday FROM Contacts WHERE ContactID = ?");
    $stmt->bind_param("s", $ContactID);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();

    // For whatever reason, the Contact was NOT found.
    if (!$row) {
        returnWithError("Could not retrieve updated Contact due to server error.");
    }

    // Return Contact to frontend with JSON format.
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

    function returnWithInfo($ContactID, $firstName, $lastName, $email, $phoneNumber, $birthday) {
        $jsonVal = sprintf('{"ContactID":"%s","firstName":"%s","lastName":"%s","email":"%s","phoneNumber":"%s","birthday":"%s","error":""}', $ContactID, $firstName, $lastName, $email, $phoneNumber, $birthday);
        sendResultInfoAsJson($jsonVal);
    }
?>