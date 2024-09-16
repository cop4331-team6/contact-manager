// COP 4331 Fall 2024

const urlBase = '/LAMPAPI';
const extension = 'php';

document.addEventListener('DOMContentLoaded', () => {
    retrieveContacts();
});

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
	
	const contactForm = document.getElementById("createContactForm");

	let firstName = contactForm.querySelector("#firstName").value;
	let lastName = contactForm.querySelector("#lastName").value;
	let email = contactForm.querySelector("#email").value;
	let birthday = contactForm.querySelector("#birthday").value;
	let phoneNumber = contactForm.querySelector("#phoneNumber").value;

	// let firstName = document.getElementById("firstName").value;
    	// let lastName = document.getElementById("lastName").value;
	// let email = document.getElementById("email").value;
	// let birthday = document.getElementById("birthday").value;
    	// let phoneNumber = document.getElementById("phoneNumber").value;


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

				if (jsonObject.error) {
					alert(`Error in creating contact: ${jsonObject.error}`);
				}
				
				retrieveContacts();
			}

			
		};
        // SEND REQUEST
		xhr.send(jsonToBeSent);
    }
    catch(err)
	{
		alert(`Error in creating contact: ${err.message}`);
	}
}

function updateContact(e) {
    const ContactID = e.value;
    // Get the ContactID to update!
    console.log(ContactID);
}

function retrieveContacts() {
    const UserID = readCookie().userId;
    const search = document.getElementsByClassName("search-bar")[0].querySelector("input").value;
    console.log(search);
    let toBeSent = {UserID:UserID, search:search};
    let jsonToBeSent = JSON.stringify(toBeSent);
    let url = urlBase + '/RetrieveContacts.' + extension;

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
					alert(`Error in loading contacts: ${jsonObject.error}`);
					return;
				}

                // Display the contacts.
                displayContacts(jsonObject);
			}
		};
        // SEND REQUEST
		xhr.send(jsonToBeSent);
    }
    catch(err)
	{
		alert(`Error in loading contacts: ${err.message}`);
	}
}

function displayContacts(contactsJson) {
    const contactListBody = document.getElementById("contact-list-body");
    const contactRowTemplate = contactListBody.querySelector("#contact-row");
    contactListBody.innerHTML = "";
    contactListBody.appendChild(contactRowTemplate);
    contactRowTemplate.style.display = 'none';
	contactsJson.Contacts.sort((a, b) => {
		return (a.firstName+a.lastName).localeCompare(b.firstName+b.lastName);
	})
    // console.log(contactsJson);
    for (const contact of contactsJson.Contacts) {
        const currContactRow = contactRowTemplate.cloneNode(true);
        currContactRow.querySelector("#contact-name").innerText = `${contact.firstName} ${contact.lastName}`;
        // const phoneNumber = `(${contact.phoneNumber.substring(0,3)}) ` +
        //                     `${contact.phoneNumber.substring(3,6)}` +
        //                     `-${contact.phoneNumber.substring(6,10)}`;
        currContactRow.querySelector("#contact-phone").innerText = contact.phoneNumber;
        currContactRow.querySelector("#contact-email").innerText = contact.email;
        currContactRow.querySelector("#edit-contact").value = contact.ContactID;
        currContactRow.querySelector("#delete-contact").value = contact.ContactID;
        currContactRow.style.display = "";
        contactListBody.appendChild(currContactRow);
        // console.log(currContactRow);
    }
}

function deleteContact(e) {
	// Delete button: should just click it, ask for confirmation, then delete

	if (e.innerText !== "Confirm") {
		e.innerText = "Confirm";
		return;
	}

	// Get the ContactID to delete!
    const contactId = e.value;

	// Read the info of the contact to delete
	let userId = readCookie().userId;
	
	let toBeSent = {userId:userId, contactId:contactId};
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
				if (jsonObject.error) {
					alert(`Error in deleting contact: ${jsonObject.error}`);
				}

				retrieveContacts();
			}
		};
        // SEND REQUEST
		xhr.send(jsonToBeSent);
    }
    catch(err)
	{
		alert(`Error in deleting contact: ${err.message}`);
	}
}

