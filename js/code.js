// Qidi Wang
// COP 4331 Fall 2024
// Code based off of code.js from Colors Lab LAMP STACK
// ADD comments

const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
// userName will be used in the cookie
let userName = "";

function testConnect() {
	window.location.href = "contact.html";
}

function doLogin() {
    userId = 0;
    
    // getElementById values are subject to change depending on frontend naming convention
    let userName = document.getElementById("user").value;
    let password = document.getElementById("password").value;
    window.location.href = "checkerror.html";


    // document.getElementById("loginResult").innerHTML = "";

	// !!!
    let toBeSent = {Username:userName,Password:password};
    let jsonToBeSent = JSON.stringify(toBeSent);

    let url = urlBase + '/Login.' + extension;

    // SET UP HTTP REQUEST
	let xhr = new XMLHttpRequest();
    // HTML method, URL, asynchronous or not
	// true allows for browser to execute other code in the meantime
	// POST request
	xhr.open("POST", url, true);
    // Content-type is the name of the HTTP header being set
	// Says body contains JSON and is encoded with UTF-8
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        // HANDLE RESPONSE
		// onreadystatechange is an event handler, executes function whenever readyState changes
		xhr.onreadystatechange = function() 
		{
			// readyState 4 means complete. Status 200 means successful
			if (this.readyState == 4 && this.status == 200) 
			{
				// Convert JSON string to JS object
				let jsonObject = JSON.parse( xhr.responseText ); //Response data
				// After converted, can assign id
				// !!!
				userId = jsonObject.UserID;
		
				if( userId < 1 )
				{		
					// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					// For debugging
					return;
				}
				
				// Save data to a cookie
				saveCookie();
				
				// Take user to the page after successfully logging in
				window.location.href = "contact.html";
			}
		};
        // SEND REQUEST
		xhr.send(jsonPayload);
		// Between sending the request and hearing back, the server determines if the login is successful
		// See Login.php
    }
    catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	// cookie valid for 30 minutes. Logout after 30 min of not using site.
	// shorter time is more secure, but we changed it from 20
	let minutes = 30;
	// current date and time
	let date = new Date();
	// set expiration time. date.getTime() returns ms
	date.setTime(date.getTime()+(minutes*60*1000));	
	// create or update cookie with these details:
	// GMT is used in cookie expiration format
	document.cookie = "userName=" + userName + ",userId=" + userId + ";expires=" + date.toGMTString();
}


function readCookie()
{
	userId = -1;
	// all cookies in one string
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		// trim gets rid of leading/trailing whitespace
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "userName" )
		{
			userName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			// parseInt converts value to integer
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		// valid user id not found
		window.location.href = "index.html";
	}

	return {userId:userId}
}

function doLogout()
{
	userId = 0;
	userName = "";
	// setting time to past ensures deletion of the cookie
	// my guess is we don't need additional lines bc we set lastname and userId to blank
	// just need one to set time to past
	document.cookie = "userName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Functions to login are complete. Need to make a signup too
// Once logged in, users create, update, retrieve, delete contacts
// Contacts need at least name and email

// Sign up very similar to log in may need to modify
function doSignUp() {
    userId = 0;
    
    // getElementById values are subject to change depending on frontend naming convention
    let userName = document.getElementById("user").value;
    let password = document.getElementById("password").value;

    // document.getElementById("signUpResult").innerHTML = "";

	// !!!
    let toBeSent = {Username:userName,Password:password};
    let jsonToBeSent = JSON.stringify(toBeSent);

    let url = urlBase + '/SignUp.' + extension;

    // SET UP HTTP REQUEST
	let xhr = new XMLHttpRequest();
    // HTML method, URL, asynchronous or not
	// true allows for browser to execute other code in the meantime
	// POST request
	xhr.open("POST", url, true);
    // Content-type is the name of the HTTP header being set
	// Says body contains JSON and is encoded with UTF-8
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        // HANDLE RESPONSE
		// onreadystatechange is an event handler, executes function whenever readyState changes
		xhr.onreadystatechange = function() 
		{
			// readyState 4 means complete. Status 200 means successful
			if (this.readyState == 4 && this.status == 200) 
			{
				// Convert JSON string to JS object
				let jsonObject = JSON.parse( xhr.responseText ); //Response data
				// After converted, can assign id
				// !!!
				userId = jsonObject.UserID;
		
				if( userId < 1 )
				{		
					// document.getElementById("signUpResult").innerHTML = "Sign Up Unsuccessful";
					return;
				}
				
				// Save data to a cookie
				saveCookie();
				
				// Take user to the page after successfully signing up
				window.location.href = "contact.html";
			}
		};
        // SEND REQUEST
		xhr.send(jsonPayload);
    }
    catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}
}

function createContact() {
	// Add button takes to html or popup to add contact
	// Text box asks for First Name, Last Name, Email, Phone Number
	// Click Save button to call this function

	contactId = 0

	// Take in the new contact information
	let userId = readCookie().userId
	let firstName = document.getElementById("firstName").value;
    	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let birthday = document.getElementById("birthday").value;
    	let phoneNumber = document.getElementById("phoneNumber").value;

	document.getElementById("addResult").innerHTML = "";

	let toBeSent = {userId:userId, firstName:firstName, lastName:lastName, email:email, birthday:birthday, phoneNumber:phoneNumber};
    	let jsonToBeSent = JSON.stringify(toBeSent);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        // HANDLE RESPONSE
		xhr.onreadystatechange = function() 
		{
			// readyState 4 means complete. Status 200 means successful
			if (this.readyState == 4 && this.status == 200) 
			{
				// Convert JSON string to JS object
				let jsonObject = JSON.parse( xhr.responseText ); //Response data
				// After converted, can assign id
				contactId = jsonObject.ContactID;
		
				// !!! Check for proper syntax
				// is this proper syntax? What happens when not properly added?
				if (contactId == "")
				{		
					document.getElementById("addResult").innerHTML = "Could Not Add Contact";
					return;
				}
				
				// !!! Maybe change what happens after. Maybe go back by clicking x button
				document.getElementById("addResult").innerHTML = "Contact Added!"
			}
		};
        // SEND REQUEST
		xhr.send(jsonPayload);
    }
    catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
}

function updateContact() {

}

function retrieveContacts() {
	// TODO
}

function deleteContact() {
	// Delete button: should just click it, ask for confirmation, then delete

	// Read the info of the contact to delete
	let userId = readCookie().userId
	let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let birthday = document.getElementById("birthday").value;
    let phoneNumber = document.getElementById("phoneNumber").value;

	document.getElementById("deleteResult").innerHTML = "";

	let toBeSent = {userId:userId, firstName:firstName, lastName:lastName, email:email, birthday:birthday, phoneNumber:phoneNumber};
    let jsonToBeSent = JSON.stringify(toBeSent);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        // HANDLE RESPONSE
		xhr.onreadystatechange = function() 
		{
			// readyState 4 means complete. Status 200 means successful
			if (this.readyState == 4 && this.status == 200) 
			{
				// Convert JSON string to JS object
				let jsonObject = JSON.parse( xhr.responseText ); //Response data
				// After converted, can assign id
				message = jsonObject.message;
		
				document.getElementById("deleteResult").innerHTML = message
			}
		};
        // SEND REQUEST
		xhr.send(jsonPayload);
    }
    catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}
