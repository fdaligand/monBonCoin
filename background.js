/*
Open a new tab, and load "my-page.html" into it.
*/
function parsePage(tab) {
  console.log("injecting");
   chrome.tabs.sendMessage(tab.id,"toto");
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(parsePage);