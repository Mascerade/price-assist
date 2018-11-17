var internal_check = "" // This is to ake sure that we only will display once
// Only executes when we receive a message from background_script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Checks if the background_script sent a message to Check Electronics
        if(request.status == "Check Electronics") {
            // Checks if the category is "Electronics"
            if(document.getElementsByClassName("nav-search-label")[0].textContent == "Electronics"){ 
                // If it is, send message back to background_script to Get Data
                sendResponse({status: "Get data"});
                // Sets the internal check to "Display"
                internal_check = "Display"
            }
        }

        // Only display the iframe if the status is to display and the internal_check says to display
        else if(request.status == "Display" && internal_check == "Display") {
            console.log("Wazzzzzupppp")
            // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
            internal_check = "DO NOTHING"
        }
    }
);
