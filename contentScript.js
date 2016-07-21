
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
function hideAddById(id) {
	/* hide add which correspon to id number*/
	//TODO: add try/catch to check if id exist
	try {
		addDict[id].style.opacity = 0.2;
	} catch(err) {
		console.log("Id :"+id+" not in the current page");
	}
	
	window.localStorage.setItem("mbc_"+id,addDict[id]);
	return true;

}

function hideAddOnClick(msg) {
	/* many message is send on the web, check if it is yours*/
	if ( msg.origin.includes("leboncoin") ) {

		/*TODO : Hide the add*/
		console.log("message received:"+msg.data);

		/* Change opacity of the add*/
		id = msg.data.split('_')[1] //TODO remove this fucking magic number
		return hideAddById(id);
		
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

function initPage(msg){
	/* Add hide button on all annonce of the page, inject script on page to interact with button*/
	
	console.log(msg);

		if (msg == "button pressed") {
			//toggle when web extension button is pressed
			if ((cliked = window.localStorage.getItem('buttonPressed')) == null ) {

				window.localStorage.setItem('buttonPressed',true);
			} else if ( cliked == "false") {
				window.localStorage.setItem('buttonPressed',true);
		} else {
			window.localStorage.setItem('buttonPressed',false);
		}
	}
	
	if (window.localStorage.getItem('buttonPressed') == "true") {
		
		injectHideActionScript();
		addDict = getAddList();
		hideAddFromLocaleStorage();

	}
		
};

function getAddList() {
/* Return a dict object with main info from add list and add hide button to the add */
		//find list of adds
	var ul = document.getElementsByClassName("tabsContent")[0].getElementsByTagName("ul")[0]
	var items = ul.getElementsByTagName("li");
	var addList = {};
	
	for (var i = 0; i < items.length ; i++) {
		
		//get data info of each add
		var add = items[i].getElementsByTagName("a")[0]
		// TODO: use Data Attributes (data-*) in a modern way with attribute dataset
		var addData = add.getAttribute("data-info");
		var addInfo = JSON.parse(addData);
		var addId = addInfo.ad_listid
		addList[addId] = add;
		if (!addHideButton(add,addId)) {
			console.log("error during creation of button for add "+addId);
		};

		console.log("add id:"+addId);
		
	};

	return addList
};

function hideAddFromLocaleStorage() {

	if (window.localStorage.getItem('buttonPressed') == "true" ) {

		/* Find id of hidden add*/
		for (var i = 0; i< localStorage.length; i++) {

			var key = localStorage.key(i);
			if ( key.includes("mbc_") ) {

				id = key.split("mbc_")[1];
				hideAddById(id);
				console.log("add "+id+" is hidden");

			}
		}

	}
}

window.addEventListener('message',hideAddOnClick);
chrome.runtime.onMessage.addListener(initPage);
window.onload = initPage;


