// Qidi Wang
// COP 4331 Fall 2024
// Code based off of code.js from Colors Lab LAMP STACK
// ADD comments

const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
// userName will be used in the cookie
let userName = "";

function doLogin() {
    userId = 0;
    
    // getElementById values are subject to change depending on frontend naming convention
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;

    document.getElementById("loginResult").innerHTML = "";

    let toBeSent = {userName:userName,password:password};
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
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				// Save data to a cookie
				saveCookie();
				
				// Take user to the page after successfully logging in
				window.location.href = "contactmanager.html";
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

