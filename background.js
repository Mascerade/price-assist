var send = true; // Checks if we should send a message to display the results
let portFromCS;
var retailer = "";

chrome.runtime.onConnect.addListener(connected)


function connected(p) {
    portFromCS = p;
    portFromCS.onMessage.addListener(function(message) {
        if (message.message == "put retailer") {
            retailer = message.retailer;
            console.log(retailer);
            portFromCS.postMessage({message: "get info"});
        }

        if (message.message == "send request") {
            const http = new XMLHttpRequest();
            const localserver = "localhost:5000";
            const timlessServer = "timeless-apps.com"
            const url = "http://" + localserver + "/price-assist/api/network-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&title=" +
            message.title + "&return_type=gui";
            http.open("GET", url);
            http.send();
            http.onload = (e) => {
                console.log("DONE?")
                data = JSON5.parse(http.responseText);
                if (http.responseText.includes("Error")) {
                    send = false;
                }

                else {
                    console.log(typeof(http.responseText));
                    portFromCS.postMessage({message: "add gui", iframe: data.iframe, head: data.head, body: data.body})
                }
            }
        }
    });
}




chrome.browserAction.onClicked.addListener(function(tab) {
    // Sends a message to the content_script saying to change the visibility of the gui
    chrome.tabs.sendMessage(tab.id, {status: "Remove"})
});
