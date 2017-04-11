/*
Open a new tab, and load "my-page.html" into it.
*/
function parsePage(tab) {
    // Send a single message to content script
    if (typeof tab.id === "number") {
        chrome.tabs.sendMessage(tab.id,"button pressed");
    }
    else
    {
        throw new TypeError("Tab have no id or wrong type");
    }
}

// // When the extension is installed or upgraded ...
// chrome.runtime.onInstalled.addListener(function() {
//   // Replace all rules ...
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     // With a new rule ...
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         // That fires when a page's URL contains a 'g' ...
//         conditions: [
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlContains: 'leboncoin' },
//           })
//         ],
//         // And shows the extension's page action.
//         actions: [ new chrome.declarativeContent.ShowPageAction() ]
//       }
//     ]);
//   });
// });


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check tab.url and send message only if tabs is in leboncoin.fr
    if (tab.url.match(/.*.leboncoin.fr.*/))
    {
        chrome.pageAction.show(tab.id);
    }
});

/*
Add parsePage() as a listener to clicks on the browser action.
*/
chrome.pageAction.onClicked.addListener(parsePage);

// function are exported for unit testing
exports.parsePageTest = parsePage;