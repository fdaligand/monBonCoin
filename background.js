/*
Open a new tab, and load "my-page.html" into it.
*/
function parsePage() {
  console.log("injecting");
   chrome.tabs.sendMessage(2);
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(parsePage);