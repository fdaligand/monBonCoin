
var addDict = {}; // contain all adds of a page 
var hiddenId = {}; // contain only the hidden adds



function injectHideActionScript() {
/* inject script on web page to manage action when hide button is clicked*/
	
	// inject script only if it not present 
	if (!document.getElementById("callHideScript")) {

		var script =  document.createElement("script");
		script.id = "callHideScript";
		
		/* When hide button is clicked, it's id, which correspond to the add id, is sent to the content script via postMessage()*/
		script.innerHTML = 'function sendMessage() { message = "button_"+event.target.id+"_cliked";window.postMessage(message,"*");event.preventDefault();}';
		
		document.body.appendChild(script);
	}
}

function hideAdd(msg) {
	/* many message is send on the web, check if it is yours*/
	if ( msg.origin.includes("leboncoin") ) {

		/*TODO : Hide the add*/
		console.log("message received:"+msg.data);

		/* Change opacity of the add*/
		id = msg.data.split('_')[1] //TODO remove this fucking magic number
		addDict[id].style.opacity = 0.2;
		hideAdd[id] = addDict[id];
	}
	
};


function addHideButton(obj,id) {
	/* add a clickable button to hide add*/

	var aside = obj.getElementsByClassName("item_absolute");
	var button = document.createElement("button")
	button.id = id;
	button.setAttribute('onclick','sendMessage()');
	button.innerHTML = "Hide this add";

	aside[0].appendChild(button);

	return true;

}

function modifyPage(msg){
	
	console.log("message received")

	injectHideActionScript();
	//toggle when web extension button is pressed
	if ((cliked = window.localStorage.getItem('buttonPressed')) == null ) {

		window.localStorage.setItem('buttonPressed',true);
	} else if ( cliked == "false") {
		window.localStorage.setItem('buttonPressed',true);	
	} else {
		window.localStorage.setItem('buttonPressed',false);
	}
	

	//find list of adds
	var ul = document.getElementsByClassName("tabsContent")[0].getElementsByTagName("ul")[0]
	var items = ul.getElementsByTagName("li");
	
	for (var i = 0; i < items.length ; i++) {
		
		//get data info of each add
		var add = items[i].getElementsByTagName("a")[0]
		var addData = add.getAttribute("data-info");
		var addInfo = JSON.parse(addData);
		var addId = addInfo.ad_listid
		addDict[addId] = add;
		if (!addHideButton(add,addId)) {
			console.log("error during creation of button for add "+addId);
		};

		console.log("add id:"+addId);
		
	};
	
	document.body.style.border = "5px solid red";
		
};

function checkPage() {

	if (window.localStorage.getItem('buttonPressed')) {

		for ( var id in hiddenId ) {

			hiddenId[id].style.opacity = 0.2;
			console.log("add "+id+" is hidden");
		}

	}
}

window.addEventListener('message',hideAdd);
chrome.runtime.onMessage.addListener(modifyPage);
window.onload = checkPage;


