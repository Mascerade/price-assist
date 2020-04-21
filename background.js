let portFromCS;
var retailer = "";
let networkScrapersDone = false; // For the process scraper GET method to check when to add the new info
let processData; // Used for sending the process data to the CS
let processScrapersDone = false; // For the message from the network scrapers in the CS to check the request is done
chrome.runtime.onConnect.addListener(connected)


function connected(p) {
    portFromCS = p;
    portFromCS.onMessage.addListener(function(message) {
        if (message.message == "put retailer") {
            // Clear the checks/data so that it doesn't interfere with future GUIs
            processScrapersDone = false;
            networkScrapersDone = false;
            processData = null;
            retailer = message.retailer;
            portFromCS.postMessage({message: "get info"});
        }

        if (message.message == "send request") {
            // Creates two seperate HTTP requests that gets
            // data from the network scrapers and process scrapers
            const networkScrapers = new XMLHttpRequest()
            const processScrapers = new XMLHttpRequest()
            const localServer = "localhost:5000";
            const timelessServer = "timeless-apps.com:5000"

            const url1 = "http://" + localServer + "/price-assist/api/network-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&price=" + message.price +
            "&title=" + message.title + "&return_type=json";

            const url2 = "http://" + localServer + "/price-assist/api/process-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&price=" +
            message.price + "&title=" + message.title + "&return_type=json";

            portFromCS.postMessage({message: "add gui"})
            networkScrapers.open("GET", url1)
            processScrapers.open("GET", url2)
            networkScrapers.send()
            processScrapers.send();

            networkScrapers.onload = (e) => {
                // When the request to the server is done, process the data here
                console.log("here in network")
                send = true; // Checks if we should send a message to display the results
                networkData = JSON5.parse(networkScrapers.responseText);
                if (networkScrapers.responseText.includes("Error")) {
                    send = false;
                }

                else {
                    portFromCS.postMessage({message: "add data", data: networkData})
                }
            }

            processScrapers.onload = (e) => {
                // When the request to the server is done, process the data here
                console.log("here in process")
                send = true;
                processData = JSON5.parse(processScrapers.responseText);
                if (processScrapers.responseText.includes("Error")) {
                    send = false
                }

                else {
                    portFromCS.postMessage({message: "add data", data: processData})
                }
            }
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    // Sends a message to the content_script saying to change the visibility of the gui
    console.log("here in browserAction")
    portFromCS.postMessage({message: "change visibility"})
});
