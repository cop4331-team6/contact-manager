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
    $search = $inData["search"];

    $stmt = $conn->prepare("SELECT Contacts.ContactID, Contacts.firstName, Contacts.lastName, Contacts.email, Contacts.phoneNumber, Contacts.birthday FROM Contacts " .
                            "LEFT JOIN Connections ON Contacts.ContactID = Connections.ContactID " .
                            "WHERE Connections.UserID = ? " .
                            "AND UPPER(CONCAT(Contacts.firstName, ' ', Contacts.lastName, ' ', Contacts.email, ' ', Contacts.phoneNumber, ' ', Contacts.birthday)) " . 
                            "LIKE CONCAT('%', UPPER(?), '%')");
    // Parameterized SQL queries for ease of use and security.
    $stmt->bind_param("ss", $UserID, $search);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    // Return all contacts (including no contacts) associated with the given UserID as a JSON array.
    returnWithInfo(json_encode($row));

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($jsonVal) {
        header('Content-type: application/json');
        echo $jsonVal;
    }

    function returnWithError($err) {
        $jsonVal = sprintf('{"Contacts":[],"error":"%s"}', $err);
        sendResultInfoAsJson($jsonVal);
        exit;
    }

    function returnWithInfo($row) {
        $jsonVal = sprintf('{"Contacts":%s,"error":""}', $row);
        sendResultInfoAsJson($jsonVal);
    }
?>