/*
Open a new tab, and load "my-page.html" into it.
*/
function parsePage(tab) {
    // Why not check if tab correspond to the leboncoin.fr 
    // check tab.url and send message only if tabs is in leboncoin.fr
    console.log("injecting");
    // Send a single message to content script
    chrome.tabs.sendMessage(tab.id,"button pressed");
}

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'leboncoin' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

/*
Add parsePage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(parsePage);