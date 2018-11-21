chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Only runs when loading the tab is complete
    if (changeInfo.status == "complete") {
        // Only executes the rest of the code if the tab is on an Amazon product page
        if (tab.url.includes("www.amazon.com") && tab.url.includes("dp")){
            // Sends a message to the content_script saying to check if the category is electronics
            chrome.tabs.sendMessage(tab.id, {status:"Check Electronics"}, function(response) {
                console.log("Sent message");
                // If the tab is on Electronics, content_script sends response to get data from server
                if(response.status == "Get data") {
                    const http = new XMLHttpRequest(); // Defines the Http request
                    const url = "http://localhost:5000/query?link=" + tab.url; // Specifies the Amazon url for the server
                    http.open("GET", url); // Sets the request to a GET request
                    http.send(); // Sends the request to the server
                    http.onreadystatechange=(e)=> { // If something gets sent back from the server
                        // Sends over the information
                        JSON.stringify(JSON5.parse(http.responseText));
                        var retailer_popup = chrome.runtime.getURL("retailers-popup.html");
                        var retailer_css = chrome.runtime.getURL("retailers-popup.css");
                        var bootstrap = chrome.runtime.getURL("Bootstrap-CSS/bootstrap.min.css");
                        chrome.tabs.sendMessage(tab.id, {status: "Display", data: http.responseText}, function(response) {}) 
                    }
                }
            });
        }
    }
});
