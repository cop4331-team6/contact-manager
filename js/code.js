// Qidi Wang
// COP 4331 Fall 2024
// Code based off of code.js from Colors Lab LAMP STACK
// ADD comments

const urlBase = '/LAMPAPI';
const extension = 'php';

function doLogin() {    
    // getElementById values are subject to change depending on frontend naming convention
	let userName = document.querySelector("#login-form").querySelector("#user").value;
    let password = document.querySelector("#login-form").querySelector("#password").value;

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
		
				if(jsonObject.error)
				{	
					document.getElementById("login-password-error").innerText = jsonObject.error;
					return;
				}
				
				// Save data to a cookie
				saveCookie(jsonObject.Username, jsonObject.UserID);
				
				// Take user to the page after successfully logging in
				window.location.href = "contact.html";
			}
		};
        // SEND REQUEST
		xhr.send(jsonToBeSent);
		// Between sending the request and hearing back, the server determines if the login is successful
		// See Login.php
    }
    catch(err)
	{
		document.getElementById("login-password-error").innerText = err.message;
	}
}

function saveCookie(userName, userId)
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

// Sign up very similar to log in may need to modify
function doSignUp() {
	let userName = document.querySelector("#signup-form").querySelector("#user").value;
    let password = document.querySelector("#signup-form").querySelector("#password").value;
	let confirmPassword = document.querySelector("#signup-form").querySelector("#confirmPassword").value;

	if (password !== confirmPassword) {
		document.getElementById("signup-password-error").innerText = "Passwords do not match";
		return;
	}


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
		
				if(jsonObject.error)
				{		
					document.getElementById("signup-password-error").innerText = jsonObject.error;
					return;
				}
				
				// Save data to a cookie
				saveCookie(jsonObject.UserName, jsonObject.UserID);
				
				// Take user to the page after successfully logging in
				window.location.href = "contact.html";
			}
		};
        // SEND REQUEST
		xhr.send(jsonToBeSent);
		// Between sending the request and hearing back, the server determines if the login is successful
		// See Login.php
    }
    catch(err)
	{
		document.getElementById("signup-password-error").innerText = err.message;
	}
}
