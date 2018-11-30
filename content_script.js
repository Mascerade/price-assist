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
                        <a class="navbar-brand" href="#">Price Checcer</a>
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
                $("iframe").contents().find("head").html("<link href='https://fonts.googleapis.com/css?family=Raleway:400,500' rel='stylesheet'><link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/i3kti4rds4wq7r9/retailers-popup.css?dl=0'><link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/snlfm9vr3j6bbj5/bootstrap-flatly.min.css?dl=0'>")
                myFrame = $("iframe").contents().find("body");
                myFrame.html(data);
                console.log(data);
                console.log(iframe);
            });
            // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
            internal_check = "DO NOTHING"
        }
    }
);

function addCard(name, price, link) {
    card = `
        <div id="card" class="card mb-3" style="max-width: 325px;">
            <div class="card-body">
                <h4 id="retailer" class="card-title">` + name +`</h4>
                <p id="base-price" class="card-text">Base Price: ` + price + `</p>
            </div>
            <a href="` + link + `" id="link-button" class="btn btn-primary" target="_blank">Link!</a>
        </div>
    `
    return card
}
