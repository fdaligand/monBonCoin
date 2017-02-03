/*
Open a new tab, and load "my-page.html" into it.
*/
function parsePage(tab) {
    // Why not check if tab correspond to the leboncoin.fr 
    // check tab.url and send message only if tabs is in leboncoin.fr
    console.log("injecting");
    chrome.tabs.sendMessage(tab.id,"button pressed");
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(parsePage);