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
            // Checks if the category is "Electronics"
            if(document.getElementsByClassName("nav-search-label")[0].textContent === "Electronics"){
                // If it is, send message back to background_script to Get Data
                sendResponse({status: "Get data"});
                // Sets the internal check to "Display"
                internal_check = "Display"
            }
            else {
                sendResponse({status: "Not valid"});
            }
        }

        // Only display the iframe if the status is to display and the internal_check says to display
        else if(request.status === "Display" && internal_check === "Display") {
            $(document).ready(function() {
                if(internal_display_count >= 1) {

                    // (FOR DEBUG) console.log("REMOVE")
                    // (FOR DEBUG) console.log(internal_display_count)
                    document.getElementById("iframe-wrapper").remove();
                }

                // Creates the iframe and the div surrounding it and assigns their id's
                iframe = document.createElement("iframe");
                iframe.id = "iframe";
                iframe_wrapper = document.createElement("div");
                iframe_wrapper.id = "iframe-wrapper";

                // The navbar of the gui
                var data = `
                    
                    <nav id="nav" class="navbar fixed-top navbar-dark bg-primary">
                        <a class="navbar-brand" href="https://binarywiz.github.io/Timeless-Apps-Website/home.html" target="_blank">
                            <img src="https://dl.dropboxusercontent.com/s/7vleowye5psd2mj/only_logo_transparent_white.png?dl=0" style="max-height: 46px; max-width: 46px;">
                            <span style="font-size: 20px; color: white; margin-left: 12px;"> Price Assist </span>
                        </a>
                        <button id="close-button" style="background-color: Transparent; background-repeat: no-repeat; border: none; outline: none;">
                            <i class="material-icons pb-close" id="close-icon" style="color: white; font-size: 24px;">close</i>
                        </button>
                    </nav>
                    <div id="card-container">
                    
                `;

                // Parses the data coming from the background
                request.data = JSON5.parse(request.data);
                // (FOR DEBUG) console.log(request.data);

                for(const [key, value] of Object.entries(request.data)) {

                    if(key === "amazon_data") {
                        data += addCard("Amazon", value, "#");
                    }

                    // Does not show the retailer if it is equal to any of these:
                    else if(value[1] === "Could Not Find Price" || value[1] === "Could not find price" || value[1] === "undefined") {
                        
                    }

                    // If there was any error on the server side and it wasn't equal to anything ^, still don't display
                    else if(value === undefined || value.length === 0) {
                        
                    }

                    // If it actually has data, display the retailer
                    else {
                        data += addCard(value[0], value[1], value[2]);
                    }
                }

                // The end tag for the div that contains all of the cards
                data += "</div>";

                // Sets the style of both the wrapper and the actual iframe and adds the iframe to the wrapper
                iframe.style.cssText = "height: 500px; width: 300px; border: none; border-radius: 5px; " +
                    "-webkit-scrollbar { \n" +
                    "width: 12px;\n" +
                    "background-color: #F5F5F5;\n" +
                    "};" +
                    "-webkit-scrollbar-thumb { \n" +
                    "border-radius: 10px;\n" +
                    "-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);\n" +
                    "background-color: #D62929;\n" +
                    "};";
                iframe_wrapper.style.cssText = "visibility: visible; border: none; width: 100%; display: flex; " +
                    "justify-content: center; align-items: center; transform: translateZ(0px); overflow: hidden; " +
                    "background-color: transparent; webkit-border-radius: 5px; -moz-border-radius: 5px; " +
                    "border-radius: 5px; height: 500; width: 300; z-index: 100000000; border: none;";
                iframe_wrapper.appendChild(iframe);

                // Appends the iframe_wrapper (which contains the iframe) to underneath the amazon product picture
                document.getElementById("leftCol").appendChild(iframe_wrapper);

                // Adds the stylesheets and other aesthetics needed for the gui
                $("iframe").contents().find("head").html("<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n" +
                    "<link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.3.0/material.indigo-pink.min.css\">\n" +
                    "<link href='https://fonts.googleapis.com/css?family=Raleway:400,500' rel='stylesheet'> \n" +
                    "<link rel='stylesheet' href='https://raw.githack.com/BinaryWiz/Price-Assist/master/css/retailers-popup.css'> \n" +
                    "<link rel='stylesheet' href='https://rawcdn.githack.com/BinaryWiz/Price-Assist/2b50e26b6f3e74a721c1c5006aac0c91321179ad/css/bootstrap-flatly.min.css'>");

                // Adds the data with the cards and the navbar to the iframe
                $("iframe").contents().find("body").html(data);
                $("iframe").addClass("scrollbar scrollbar-primary");
                // When the "X" is pressed, set the visibility of the gui to hidden
                $("iframe").contents().find("#close-button").click(function() {

                    // (FOR DEBUG) console.log("WORKED!");
                    iframe_wrapper.style.setProperty("visibility", "hidden");
                });
                var top_of_iframe = $("#iframe-wrapper").position().top;
                console.log(top_of_iframe);
                window.scrollTo({top: top_of_iframe - (top_of_iframe * 0.1), left: 0, behavior: "smooth"});
                console.log($("body").position().top);
                // For when the url changes on the same amazon page; Makes sure there is only 1 gui
                internal_display_count += 1;
            });
            // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
            internal_check = "DO NOTHING";
        }
    }
);

function addCard(name, price, link) {

    // Adds the custom data of each individual retailer to the card
    var card = `
        <div id="card" class="card mb-3" style="max-width: 325px;">
            <div class="card-body">
                <h4 id="retailer" class="card-title">` + name +`</h4>
                <p id="base-price" class="card-text">Base Price: ` + price + `</p>
            </div>
            <a href="` + link + `" id="link-button" class="btn btn-primary" target="_blank">Link!</a>
        </div>
    `;
    return card;
}
