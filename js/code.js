const urlBase = 'https://cis4004-lampstack.xyz/LAMPAPI'; //Change this once we have a domain.
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let lastSearch = "";
let currentContactId = 0; 

// Login function. 
function doLogin()
{
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// Logout function.
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Add contact function.
function addContact()
{
	let firstName = document.getElementById("addFirstName").value;
	let lastName = document.getElementById("addLastName").value;
	let email = document.getElementById("addEmail").value;
	let phone = document.getElementById("addPhone").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, email:email, phone:phone, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

 // Show edit contact form function.
function showEdit(id, firstName, lastName, email, phone)
{
    currentContactId = id;
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editDiv").style.display = "block";
}

// Search contact function.
function searchContacts()
{
	let contactList = "";
	lastSearch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let tmp = {search:lastSearch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += '<div class="contact-item">';
					contactList += '<span>' + jsonObject.results[i].firstName + ' ' + jsonObject.results[i].lastName + ' - ' + jsonObject.results[i].email + ' - ' + jsonObject.results[i].phone + '</span>';
					contactList += '<button onclick="deleteContact(' + jsonObject.results[i].id + ')">Delete</button>';
					contactList += '<button onclick="showEdit(' + jsonObject.results[i].id + ',\'' + jsonObject.results[i].firstName + '\',\'' + jsonObject.results[i].lastName + '\',\'' + jsonObject.results[i].email + '\',\'' + jsonObject.results[i].phone + '\')">Edit</button>';
					contactList += '</div>';
				}	

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

/* FUNCTIONS TO IMPLEMENT*/

// Register function.
function doRegister(){

	let login = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	
	let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};

	document.getElementById("registerResult").innerHTML = "";
	
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = "User already exists.";
					return;
				}	
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

// Delete contact functino.
function deleteContact(contactId){
    let tmp = {contactId: contactId, userId:userId};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error == "") {
                    searchContacts();
                } else {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

// Edit contact function.
function editContact(contactId)
{
    currentContactId = contactId;
    document.getElementById("editDiv").style.display = "block";
    
    let firstName = document.getElementById("editFirstName").value;
    let lastName = document.getElementById("editLastName").value;
    let email = document.getElementById("editEmail").value;
    let phone = document.getElementById("editPhone").value;
    document.getElementById("editResult").innerHTML = "";
    let tmp = {contactId:contactId, userId:userId, firstName:firstName, lastName:lastName, email:email, phone:phone};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/EditContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.error == "")
                {
                    document.getElementById("editResult").innerHTML = "Contact updated successfully.";
                    document.getElementById("editDiv").style.display = "none";
                    searchContacts();
                }
                else
                {
                    document.getElementById("editResult").innerHTML = jsonObject.error;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message;
    }
}

// contact list function

function userContactList()
{
    let search = "";
    let tmp =
    {
        search : search,
        userId : userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            let jsonObject = JSON.parse(xhr.responseText);
            let output = "";
            if(jsonObject.results.length == 0)
            {
                output = "No contacts found.";
            }
            else
            {
                for(let i = 0; i < jsonObject.results.length; i++)
                {
                    output +=
                    `
                    <div class="contactCard">
                        <div class="contactName">
                            ${jsonObject.results[i].firstName}
                            ${jsonObject.results[i].lastName}
                        </div>

                        <div class="contactInfo">
                            Email: ${jsonObject.results[i].email}<br>
                            Phone: ${jsonObject.results[i].phone}
                        </div>
                    </div>
                    `;
                }
            }

            document.getElementById("contactListContainer").innerHTML = output;
        }
    };

    xhr.send(jsonPayload);
}
