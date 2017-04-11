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

// Show icon only when tab url is leboncoin.fr
function showMonBonCoinIcon(tabId, changeInfo, tab) {
    // check tab.url and send message only if tabs is in leboncoin.fr
    if (tab.url.match(/.*.leboncoin.fr.*/))
    {
        chrome.pageAction.show(tabId);
    }
    else
    {
        chrome.pageAction.hide(tabId);
    }
}

// register method for each new tab or updating of tab
chrome.tabs.onUpdated.addListener(showMonBonCoinIcon);
// Add parsePage() as a listener to clicks on the page action.
chrome.pageAction.onClicked.addListener(parsePage);
// function are exported for unit testing
exports.parsePageTest = parsePage;
exports.showMonBonCoinIcon = showMonBonCoinIcon;