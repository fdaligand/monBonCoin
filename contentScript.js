

function injectHideActionScript() {
/* inject script on web page to manage action when hide button is clicked*/
	
	// inject script only if it not present 
	if (!document.getElementById("callHideScript")) {

		var script =  document.createElement("script");
		script.id = "callHideScript";
		
		/* When hide button is clicked, it's id, which correspond to the add id, is sent to the content script via postMessage()*/
		script.innerHTML = 'function sendMessage(id) { message = "button "+id+" cliked";window.postMessage(message,"*");}';
		
		document.body.appendChild(script);
	}
}

function hideAdd(msg) {
	/* many message is send on the web, check if it is yours*/
	if ( msg.origin.includes("leboncoin") ) {

		/*TODO : Hide the add*/
		console.log("message received:"+msg.data);
	}
	
};

function addHideButton(obj,id) {
	/* add a clickable button to hide add*/

	var aside = obj.getElementsByClassName("item_absolute");
	var button = document.createElement("button")
	button.id = id;
	button.setAttribute('onclick','sendMessage(this.id)');
	button.innerHTML = "Hide this add";

	aside[0].appendChild(button);

	return true;

}

function modifyPage(msg){
	
	console.log("message received")

	injectHideActionScript();

	//find list of adds
	var ul = document.getElementsByClassName("tabsContent")[0].getElementsByTagName("ul")[0]
	var items = ul.getElementsByTagName("li");
	
	for (var i = 0; i < items.length ; i++) {
		
		//get data info of each add
		var add = items[i].getElementsByTagName("a")[0]
		var addData = add.getAttribute("data-info");
		var addInfo = JSON.parse(addData);
		var addId = addInfo.ad_listid

		if (!addHideButton(add,addId)) {
			console.log("error during creation of button for add "+addId);
		};

		console.log("add id:"+addId);
		
	};
	
	document.body.style.border = "5px solid red";
		
};


window.addEventListener('message',hideAdd);
chrome.runtime.onMessage.addListener(modifyPage);


