// just for js example

// ajax post by button event
var send = document.querySelector(".send") ;
send.addEventListener("click", submit, );
function submit() {
	var email = document.querySelector(".email") ;
	var password = document.querySelector(".password") ;
	var account = {} ;
	account.email = email.value ;
	account.password = password.value;
	var data = JSON.stringify(account);

	// post
	var xhr = new XMLHttpRequest();
	xhr.open('post', 'https://hexschool-tutorial.herokuapp.com/api/signup', true);
	xhr.setRequestHeader('Content-type', "application/json");
	xhr.send(data);

	// show dialog
	xhr.onload = function() {
		respData = JSON.parse(xhr.responseText) ;
		if (respData.success) {
			alert(respData.message) ;
		}
		else {
			alert("Error : "+respData.message) ;
		}
	}
}

// login process
var send = document.querySelector(".sendLog") ;
send.addEventListener("click", submitLog, );
function submitLog() {
	var email = document.querySelector(".emailLog") ;
	var password = document.querySelector(".passwordLog") ;
	var account = {} ;
	account.email = email.value ;
	account.password = password.value;
	var data = JSON.stringify(account);

	// post
	var xhr = new XMLHttpRequest();
	xhr.open('post', 'https://hexschool-tutorial.herokuapp.com/api/signin', true);
	xhr.setRequestHeader('Content-type', "application/json");
	xhr.send(data);

	// show dialog
	xhr.onload = function() {
		respData = JSON.parse(xhr.responseText) ;
		if (respData.success) {
			alert(respData.message) ;
		}
		else {
			alert("Error : "+respData.message) ;
		}
	}
}