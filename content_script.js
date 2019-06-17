var internal_check = ""; // This is to make sure that we only will display once
var internal_display_count = 0; // Makes sure that only 1 gui will every be shown at a time
var iframe; // Makes the global iframe variable
var iframe_wrapper; // Makes the global iframe_wrapper

// Only executes when we receive a message from background_script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.status === "Remove") {

            // Checks if the iframe and iframe_wrapper has been made
            if(typeof iframe_wrapper != undefined || typeof iframe_wrapper != null) {
                // (FOR DEBUGGING) console.log(iframe_wrapper.style.visibility);

                // If the visibility of iframe_wrapper is already hidden, make it visible
                if (iframe_wrapper.style.visibility === "hidden") {
                    iframe_wrapper.style.setProperty("visibility", "visible");
                }

                // Make it hidden if it is visible
                else {
                    iframe_wrapper.style.setProperty("visibility", "hidden");
                }
            }
        }

        // Checks if the background_script sent a message to Check Electronics
        if(request.status === "Check Electronics") {
            if(document.getElementsByClassName("nav-search-label")[0].textContent === "Electronics") {
                let price;
                try {
                    // Gets the price
                    price = document.getElementById("priceblock_ourprice").textContent;
                }

                catch(err) {
                    try {
                        // In case the priceblock_ourprice doesn't contian the price, get the dealprice instead (backup)
                        price = document.getElementById("priceblock_dealprice").textContent;
                    }

                    catch (err) {
                        try {
                            price = document.getElementById("priceblock_saleprice").textContent;
                        }

                        catch(err) {
                            price = "Price Not Available";
                        }
                    }
                }
                // Defines both the item_model and the rows containing the item model (product description)
                let item_model;
                let row_content = document.getElementsByClassName("a-size-base");

                // Gets the item_model through this loop
                for(let i = 0; i < row_content.length; i++) {
                    if(row_content[i].textContent.includes("Item model number")) {
                        item_model = row_content[i+1].textContent;
                    }
                }
                // Gets rid of the whitespace of the item_model
                item_model = item_model.replace(/\s/g, "");

                // Sets the internal check to "Display"
                internal_check = "Display";
                // If it is, send message back to background_script to Get Data
                sendResponse({status: "Get data", price: price, item_model: item_model});
            }

            else {
                sendResponse({status: "Not valid"});
            }
        }

        // Only display the iframe if the status is to display and the internal_check says to display
        else if(request.status === "Display" && internal_check === "Display") {

            // Allows you to use jquery
            $(document).ready(function() {

                // This is to remove the "old" iframe and replace it with the new one generated
                if(internal_display_count >= 1) {
                    document.getElementById("iframe-wrapper").remove();
                }

                // Parse the request data that contains the html that has the iframe
                request.data = JSON5.parse(request.data);

                // Put iframe where the left column is
                document.getElementById("image-canvas-caption").innerHTML += request.data["iframe"];
                // document.getElementsByTagName("body")[0].innerHTML += request.data["iframe"];

                // Insert the html from the server in necessary places
                $("iframe").contents().find("head").html(request.data["head"]);
                $("iframe").contents().find("body").html(request.data["body"]);

                // If the "X" is clicked, make it hidden
                $("iframe").contents().find("#close-button").click(function() {
                    iframe_wrapper.style.setProperty("visibility", "hidden");
                });
                iframe_wrapper = document.getElementById("iframe-wrapper");

                // Scrolls up to the iframe that is in the leftCol
                var top_of_iframe = $("#iframe-wrapper").position().top;
                window.scrollTo({top: top_of_iframe - (top_of_iframe * 0.1), left: 0, behavior: "smooth"});

                // For when the url changes on the same amazon page; Makes sure there is only 1 gui
                internal_display_count += 1;
            });
            // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
            internal_check = "DO NOTHING";
        }
    }
);
