var internal_check = 0; // This is to make sure that we only will display once
var internal_display_count = 0; // Makes sure that only 1 gui will every be shown at a time
var iframe; // Makes the global iframe variable
var iframe_wrapper; // Makes the global iframe_wrapper


let port = chrome.runtime.connect({name:"cs-port"});

url = window.location.toString();
if (url.includes("www.amazon.com") && (url.includes("dp") || url.includes("gp"))) {
    port.postMessage({message: "put retailer", retailer: "Amazon"})
}

port.onMessage.addListener(function(message) {
    if (message.message == "get info") {
        var check = false;
        let topics = document.getElementsByClassName("a-link-normal a-color-tertiary");
        let category = document.getElementsByClassName("nav-search-label")[0].textContent;

        if (category == "Electronics" || category == "Computers" || category == "All") {
            check = true;
        }

        if(check) {
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
                        try {
                            price = document.getElementById("availability").textContent;
                        }

                        catch(err) {
                            price = "Price Not Available";
                        }
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

            // Now, we have to get the title of the product
            let productTitle = document.getElementById("productTitle").textContent.trim(" ");

            // If it is, send message back to background_script to Get Data

            internal_check += 0;
             // Send message to send request to timeless apps
            port.postMessage({message: "send request", item_model: item_model, price: price, title: productTitle});
        }
    }


    if (message.message == "add gui") {
        // Allows you to use jquery
        $(document).ready(function() {

            // This is to remove the "old" iframe and replace it with the new one generated
            if(internal_display_count >= 1) {
                document.getElementById("iframe-wrapper").remove();
            }

            // Put iframe where the left column is
            document.getElementById("image-canvas-caption").innerHTML += message.iframe;

            // Insert the html from the server in necessary places
            $("iframe").contents().find("head").html(message.head);
            $("iframe").contents().find("body").html(message.body);

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
            console.log("added the gui")
            port.postMessage({message: "add process scrapers"})
        });
        // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
        internal_check = "DO NOTHING";
    }

    if (message.message == "add process scrapers") {
        console.log("got message from process scrapers")
        console.log(document.getElementById("iframe"));
        document.getElementById("iframe").contentWindow.document.getElementById("card-container").innerHTML += message.body;
    }

});
