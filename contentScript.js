
debugger;


function modifyPage(){
	document.body.style.border = "5px solid red";	
}

chrome.runtime.onMessage.addListener(modifyPage);

document.body.style.border = "5px solid blue";