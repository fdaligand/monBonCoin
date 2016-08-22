
var addDict = {}; // contain all adds of a page 
var hiddenId = {}; // contain only the hidden adds
var request = null; // contain the request to indexedDB API
var db = null; // contain db instance 



/******** IndexedDB code *********************************/

// Test compatibilities 
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
 
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

// dummy data for test 
const customerData = [
  { id: "444-464-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { id: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

// Delete previous DB for debug 
var requestDelete = window.indexedDB.deleteDatabase("MonBonCoinDB");

// Open the DB 
var request = window.indexedDB.open("MonBonCoinDB",1);


// Error on open 
request.onerror = function(event) {

	console.log("Openning of DB fail");
};

// Open is ok 
request.onsuccess = function(event) {

	db = event.target.result; //contain the instance of DB
	var transaction  = db.transaction(["hideAdList"],"readwrite")
	var objectStore = transaction.objectStore("hideAdList");

	for (var i in customerData) {
  		var req = objectStore.add(customerData[i]);
  	}


};

//Openning new DB

request.onupgradeneeded = function (event) {

	var db = event.target.result;
	// create object store for the db 
	var objectStore = db.createObjectStore("hideAdList",{keyPath: "id"});		
};





/*********************************************************/


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
		addDict[id].htmlElement.style.opacity = 0.2;
	} catch(err) {
		console.log("Id :"+id+" not in the current page");
	}
	
	/* New implementation
	   Save ad info in indexedDB 
	*/

	saveAdInfoInDB(id);
	window.localStorage.setItem("mbc_"+id,addDict[id]);
	return true;

}

function hideAddOnClick(msg) {
	/* many message is send on the web, check if it is yours*/
	if ( msg.origin.includes("leboncoin") ) {

		/*TODO : Hide the add*/
		console.log("message received:"+msg.data);

		/* Change opacity of the add
		the form of the message is button_<ad_ID>_cliked. We take only the ID
		*/
		id = msg.data.split('_')[1] //TODO remove this fucking magic number
		return hideAddById(id);
		
	}
	
};

function addHideButton(obj,id) {
	/* add a clickable button to hide add*/

	if ( ! document.getElementById(id)) 
	{
		var aside = obj.htmlElement.getElementsByClassName("item_absolute");
		var button = document.createElement("button")
		button.id = id;
		button.setAttribute('onclick','sendMessage()');
		button.innerHTML = "Hide";
		button.style.backgroundColor = "#f56b2a";
		button.style.fontFamily = "OpenSansSemiBold ,sans-serif";
		button.style.color = "#fff"
		button.style.float = "right";


		aside[0].appendChild(button);
		return true;
	} else {
		console.log("hide button already here!");
		return false;
	}

	

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
			// if user click on webExtension button to deactivate it, reload the page!
			location.reload();
		}
	}
	
	if (window.localStorage.getItem('buttonPressed') == "true") {
		
		injectHideActionScript();
		addDict = getAddList();
		hideAddFromLocaleStorage();



	}

	// if user click on webExtension button to deactivate it, reload the page!


		
};

function parseAd(ad){

	var adParsed = {}
	//use of HTML5 dataset propierty 
	var addData = JSON.parse(ad.dataset.info);

	//id
	adParsed.id = addData.ad_listid;
	//html element
	adParsed.htmlElement = ad;
	// title
	adParsed.title = ad.title;
	//link 
	adParsed.link = ad.href;
	
	//get info on location, price 
	var itemSupp = ad.getElementsByClassName("item_supp");
	
	// first itemSupp is for pro 
	if ( itemSupp[0].getElementsByClassName("ispro")) {

		adParsed.pro = true;
	} else {
		adParsed.pro = false;
	}

	// second itemSup is location 
	text = itemSupp[1].innerHTML;
	//TODO manage the case if no city or dep are set
	try {
		[city,dep] = text.trim().split('/');
		adParsed.city = city.trim();
		adParsed.dep = dep.trim();
	} catch (err){

	console.log("error on location parsing of id ${adParsed.id}")
	}
	

	// class item_price contain price !!! 
	price = ad.getElementsByClassName("item_price")[0].innerHTML;
	adParsed.price = price.trim();

	//get image DataUrl to generate unique index
	//TODO: manage add without photo 
	img = ad.getElementsByClassName("lazyload loaded")[0];
	imgDataUrl = img.dataset.imgsrc;
	var re = /thumbs\/([a-zA-Z0-9+=\/]*).jpg$/; 
	adParsed.imghash = re.exec(imgDataUrl)[0];

	// find date of the ad 
	dateElement = ad.getElementsByClassName("item_absolute")[0];
	date = dateElement.getElementsByClassName("item_supp")[0].innerHTML.trim()
	adParsed.date = date;

	return adParsed
}

function getAddList() {
/* Return a dict object with main info from add list and add hide button to the add */
		//find list of adds
	var ul = document.getElementsByClassName("tabsContent")[0].getElementsByTagName("ul")[0]
	var items = ul.getElementsByTagName("li");
	var addList = {};
	
	for (var i = 0; i < items.length ; i++) {
		
		//get data info of each add
		var add = parseAd(items[i].getElementsByTagName("a")[0])


		/*// TODO: use Data Attributes (data-*) in a modern way with attribute dataset
		var addData = add.getAttribute("data-info");
		var addInfo = JSON.parse(addData);
		var addId = addInfo.ad_listid */
		addList[add.id] = add;
		if (!addHideButton(add,add.id)) {
			console.log("error during creation of button for add "+add.id);
		};

		console.log("add id:"+add.id);
	}

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


