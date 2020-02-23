let portFromCS;
var retailer = "";
let processScrapersData;
let networkScrapersDone = false;
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
            const networkScrapers = new XMLHttpRequest()
            const processScrapers = new XMLHttpRequest()
            const localserver = "localhost:5000";
            const timlessServer = "timeless-apps.com"
            
            const url1 = "http://" + localserver + "/price-assist/api/network-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&title=" +
            message.title + "&return_type=gui";
            
            const url2 = "http://" + localserver + "/price-assist/api/process-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&title=" +
            message.title + "&return_type=gui";

            networkScrapers.open("GET", url1)
            processScrapers.open("GET", url2)
            networkScrapers.send()
            processScrapers.send()
            ;

            networkScrapers.onload = (e) => {
                console.log("here in network")
                send = true; // Checks if we should send a message to display the results
                data = JSON5.parse(networkScrapers.responseText);
                if (networkScrapers.responseText.includes("Error")) {
                    send = false;
                }

                else {
                    portFromCS.postMessage({message: "add gui", iframe: data.iframe, head: data.head, body: data.body})
                    networkScrapersDone = true;
                }
            }

            processScrapers.onload = (e) => {
                console.log("here in process")
                send = true;
                processData = JSON5.parse(processScrapers.responseText);
                if (processScrapers.responseText.includes("Error")) {
                    send = false
                }

                else {
                    portFromCS.postMessage({message: "add process scrapers", body: processData.body})
                }
            }
        }
    });
}




chrome.browserAction.onClicked.addListener(function(tab) {
    // Sends a message to the content_script saying to change the visibility of the gui
    chrome.tabs.sendMessage(tab.id, {status: "Remove"})
});
