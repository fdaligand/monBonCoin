

var buttonPressed = false;


function modifyPage(msg){
	console.log("message received")
	console.log("mesage"+msg)
	document.body.style.border = "5px solid red";
	buttonPressed = true;	
};

chrome.runtime.onMessage.addListener(modifyPage);

if (! buttonPressed ) {
	document.body.style.border = "5px solid blue";
}


