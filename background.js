var send = true; // Checks if we should send a message to display the results
let retailer;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Only runs when loading the tab is complete
    if (changeInfo.status == "complete") {
        // Only executes the rest of the code if the tab is on an Amazon product page
        if (tab.url.includes("www.amazon.com") && (tab.url.includes("dp") || tab.url.includes("gp"))){
            retailer = "Amazon";
            // Sends a message to the content_script saying to check if the category is electronics
            chrome.tabs.sendMessage(tab.id, {status:"Check Electronics"}, function(response) {
                // If the tab is on Electronics, content_script sends response to get data from server
                if(response.status == "Get data") {
                    const http = new XMLHttpRequest(); // Defines the Http request
                    let localserver = "10.0.0.191:5000"
                    let timelessServer = "timeless-apps.com"
                    let url = "http://" + localserver + "/api/query?retailer=" + retailer +
                    "&price=" + response.price + "&item_model=" + response.item_model + "&title=" + response.title + "&return_type=gui";
                    // let url = "http://localhost:5000/api/query?retailer=" + retailer + "&price=" + response.price + "&item_model=" + response.item_model + "&return_type=gui";
                    http.open("GET", url); // Sets the request to a GET request
                    http.send(); // Sends the request to the server
                    http.onreadystatechange=(e)=> { // If something gets sent back from the server
                        // Converts the string coming from the server to an actual JSON
                        JSON.stringify(JSON5.parse(http.responseText));

                        // If there was an error getting the item model, don't display anything to the user
                        if(http.responseText.includes("Error")){
                            send = false;
                        }

                        // Send message only if there was actual info in server response
                        if(send == true) {
                            // Sends the information from the server to the content_script to display the information
                            chrome.tabs.sendMessage(tab.id, {
                                status: "Display",
                                data: http.responseText
                            }, function (response) {
                            });
                        }
                    }
                }
                send = true;
            });
        }
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    // Sends a message to the content_script saying to change the visibility of the gui
    chrome.tabs.sendMessage(tab.id, {status: "Remove"})
});
