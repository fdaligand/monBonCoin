# monBonCoin
WebExtension to rearange the visualization in leboncoin.fr

# Usefull Doc to start on project 
[WebExtension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)


# Internal functionning 

When user click on the monBonCoin button, we check if the active tab of the browser is connected to leboncoin site.
We check if it the page which aggregate all adds (url shall contain offres).
If page is ok, we parse the page and get the id of all adds. 
We add a button on each add to allow user to hide this add.

# Web Storage utilization 

## Save id of hidden adds

When user laod a add list wen page from leboncoin, if the id of the add is contained on stored value then the add is hidden. 
When user click return from an specific add page, previous adds already hidden shall not be visible. 

