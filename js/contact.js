// COP 4331 Fall 2024

const urlBase = '/LAMPAPI';
const extension = 'php';

function readCookie()
{
	let returnObject = {};
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
			returnObject.userName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			// parseInt converts value to integer
			returnObject.userId = parseInt( tokens[1].trim() );
		}
	}
	
	if (!returnObject.userId)
	{
		// valid user id not found
		window.location.href = "index.html";
	}

	return returnObject;
}

function doLogout()
{
	// setting time to past ensures deletion of the cookie
	// my guess is we don't need additional lines bc we set lastname and userId to blank
	// just need one to set time to past
	document.cookie = "userName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContact() {
	// Add button takes to html or popup to add contact
	// Text box asks for First Name, Last Name, Email, Phone Number
	// Click Save button to call this function

	// Take in the new contact information
	let userId = readCookie().userId;
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
		document.getElementById("addResult").innerText = err.message;
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
		document.getElementById("deleteResult").innerText = err.message;
	}
}

