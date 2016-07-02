

function modifyPage(msg){
	console.log("message received")

	var ul = document.getElementsByClassName("tabsContent")[0].getElementsByTagName("ul")[0]
	var items = ul.getElementsByTagName("li");
	for (var i = 0; i <= items.length ; i++) {
		
		var addData = items[i].getElementsByTagName("a")[0].getAttribute("data-info");
		var addInfo = JSON.parse(addData);
		var addId = addInfo.ad_listid
		console.log("add id:"+addId);
		addHideButton(addId);
	};
	
	document.body.style.border = "5px solid red";
		
};

chrome.runtime.onMessage.addListener(modifyPage);


