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
                    if(value != "Could not find price" || value != '') {
                        name = key.split("_")[0].charAt(0).toUpperCase() + key.split("_")[0].slice(1);
                        data += addCard(name, value, "Could not find", value);    
                        console.log("got here");
                    }
                }
                data += "</div>";

                iframe.style.cssText = "height: 500px; width: 325px; border: none; border-radius: 5px";
                iframe_wrapper.style.cssText = "border: none; transform: translateZ(0px); overflow: hidden; background-color: transparent; webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; height: 500; width: 325; z-index: 100000000; box-shadow: 5px 5px 2px 1px rgba(0, 0, 255, .2); border: none; position: absolute; top: 150px; right: 70px;"
                iframe_wrapper.appendChild(iframe)
                document.body.appendChild(iframe_wrapper);
                $("iframe").contents().find("head").html("<link href='https://fonts.googleapis.com/css?family=Raleway:400,500' rel='stylesheet'><link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/i3kti4rds4wq7r9/retailers-popup.css?dl=0'><link rel='stylesheet' href='https://dl.dropboxusercontent.com/s/jvizvi2uqaopm79/bootstrap.min.css?dl=0'>")
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

function addCard(name, price, shipping, total) {
    card = `
        <div id="card" class="card mb-3" style="max-width: 325px;">
            <div class="card-body">
                <h4 id="retailer" class="card-title">` + name +`</h4>
                <p id="base-price" class="card-text">Base Price: ` + price + `</p>
                <p id="shipping" class="card-text">Shipping: ` + shipping + `</p>
                <p id="total" class="card-text">Total Cost: ` + total + `</p> 
            </div>
            <button id="link-button" type="button" class="btn btn-primary">Link!</button>
        </div>
    `
    return card
}
