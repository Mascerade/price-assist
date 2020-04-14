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
            const localserver = "localhost:5000";
            const timelessServer = "timeless-apps.com:5000"

            const url1 = "http://" + timelessServer + "/price-assist/api/network-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&price=" + message.price +
            "&title=" + message.title + "&return_type=gui";

            const url2 = "http://" + timelessServer + "/price-assist/api/process-scrapers" +
            "?retailer=" + retailer + "&item_model=" + message.item_model + "&price=" +
            message.price + "&title=" + message.title + "&return_type=gui";

            networkScrapers.open("GET", url1)
            processScrapers.open("GET", url2)
            networkScrapers.send()
            processScrapers.send();

            networkScrapers.onload = (e) => {
                // When the request to the server is done, process the data here
                console.log("here in network")
                send = true; // Checks if we should send a message to display the results
                data = JSON5.parse(networkScrapers.responseText);
                if (networkScrapers.responseText.includes("Error")) {
                    send = false;
                }

                else {
                    console.log(data.body)
                    portFromCS.postMessage({message: "add gui", iframe: data.iframe, head: data.head, body: data.body})
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
                    console.log(networkScrapersDone)
                    if (networkScrapersDone) {
                        console.log(processData.body)
                        portFromCS.postMessage({message: "add process scrapers", body: processData.body})
                    }

                    else {
                        processScrapersDone = true
                    }
                }
            }
        }

        if (message.message == "add process scrapers") {
            // This is for when the process scrapers finishes its requests
            // Before the network scraper request finishes
            console.log("from outside of add process scrapers", processScrapersDone)
            networkScrapersDone = true
            if (processScrapersDone) {
                console.log("from add process scrapers")
                console.log(processData.body)
                portFromCS.postMessage({message: "add process scrapers", body: processData.body})
            }
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    // Sends a message to the content_script saying to change the visibility of the gui
    console.log("here in browserAction")
    portFromCS.postMessage({message: "change visibility"})
});
