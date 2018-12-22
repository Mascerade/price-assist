var internal_check = "" // This is to ake sure that we only will display once
var retailers_array;
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
            else {
                sendResponse({status: "Not valid"});
            }
        }

        // Only display the iframe if the status is to display and the internal_check says to display
        else if(request.status == "Display" && internal_check == "Display") {
            $(document).ready(function() {
                var iframe = document.createElement("iframe");
                iframe.id = "iframe";
                var iframe_wrapper = document.createElement("div");
                data = `
                    
                    <nav id="nav" class="navbar fixed-top navbar-dark bg-primary">
                        <a class="navbar-brand" href="https://binarywiz.github.io/Timeless-Apps-Website/home.html" target="_blank">
                            <img src="https://dl.dropboxusercontent.com/s/wi3nwhlki20gxy1/cropped_white_logo.png?dl=0" style="max-height: 70px; max-width: 70px;">
                            <span style="font-size: 30px;"> Priceer </span>
                        </a>
                        <button id="close-button" style="background-color: Transparent; background-repeat: no-repeat; border: none; outline: none;">
                            <i class="material-icons pb-close" id="close-icon" style="color: white; font-size: 24px;">close</i>
                        </button>
                    </nav>
                    <div id="card-container">
                    
                `
                request.data = JSON5.parse(request.data);
                console.log(request.data);

                
                for(const [key, value] of Object.entries(request.data)) {
                    if(key == "amazon_data") {
                        data += addCard("Amazon", value, "#")
                    }

                    else if(value[1] == "Could Not Find Price" || value[1] == "Could not find price" || value[1] == "undefined") {
                        
                    }

                    else if(value == undefined || value.length == 0) {
                        
                    }

                    else {
                        data += addCard(value[0], value[1], value[2])
                    }
                }
                data += "</div>";

                iframe.style.cssText = "height: 500px; width: 300px; border: none; border-radius: 5px; margin-left: 25%;";
                iframe_wrapper.style.cssText = "border: none; transform: translateZ(0px); overflow: hidden; background-color: transparent; webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; height: 500; width: 300; z-index: 100000000; border: none;"
                iframe_wrapper.appendChild(iframe)
                // document.body.appendChild(iframe_wrapper);
                document.getElementById("leftCol").appendChild(iframe_wrapper)
                $("iframe").contents().find("head").html("<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n" +
                    "<link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.3.0/material.indigo-pink.min.css\">\n" +
                    "<link href='https://fonts.googleapis.com/css?family=Raleway:400,500' rel='stylesheet'> \n" +
                    "<link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/i3kti4rds4wq7r9/retailers-popup.css?dl=0'><link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/snlfm9vr3j6bbj5/bootstrap-flatly.min.css?dl=0'>")
                $("iframe").contents().find("body").html(data);
                $("iframe").contents().find("#close-button").click(function() {
                    console.log("WORKED!");
                    iframe_wrapper.style.setProperty("visibility", "hidden")
                });
            });
            // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
            internal_check = "DO NOTHING"
        }
    }
);

function addCard(name, price, link) {
    var card = `
        <div id="card" class="card mb-3" style="max-width: 325px;">
            <div class="card-body">
                <h4 id="retailer" class="card-title">` + name +`</h4>
                <p id="base-price" class="card-text">Base Price: ` + price + `</p>
            </div>
            <a href="` + link + `" id="link-button" class="btn btn-primary" target="_blank">Link!</a>
        </div>
    `;
    return card
}
