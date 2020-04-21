var internal_check = 0; // This is to make sure that we only will display once
var internal_display_count = 0; // Makes sure that only 1 gui will every be shown at a time
var iframe; // Makes the global iframe variable
var iframe_wrapper; // Makes the global iframe_wrapper

// This is going to be the contents of the head tag of Price Assist
var headElements = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price Assist GUI<\/title>
    <link rel="stylesheet" href="https:\/\/fonts.googleapis.com\/icon?family=Material+Icons">
    <link rel="stylesheet" href="https:\/\/use.fontawesome.com\/releases\/v5.3.1\/css\/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <link rel="stylesheet" href="https:\/\/dl.dropbox.com\/s\/dffi0ovzjw5yhci\/price-assist.css">

    <link href="https:\/\/fonts.googleapis.com\/css2?family=Muli:wght@200;300&family=Quicksand:wght@300;400&display=swap" rel="stylesheet">
`

// The body of Price Assist
var bodyElements = `
<div id="price-assist-wrapper">
    <div class="unset" id="price-assist-heading">
        <a href="http:\/\/www.timeless-apps.com\/" target="_blank"><img id="price-assist-logo" src="https:\/\/dl.dropbox.com\/s\/7vleowye5psd2mj\/only_logo_transparent_white.png?raw=0" alt="Logo"><\/a>
        <h3>Price Assist<\/h3>
        <i class="material-icons pb-close" id="price-assist-close-icon">close<\/i>
    <\/div>

    <div class="unset" id="price-assist-content">
      <div class="unset price-assist-card" v-for="retailer in retailerData">
          <div class="unset price-assist-inner-card">
              <p class="unset price-assist-title">{{retailer[0]}}<\/p>
              <div class="unset price-assist-price-img-container">
                  <p class="unset price-assist-price">Price: $ {{retailer[1]}}<\/p>
                  <img class="unset price-assist-price-money-img" src="https:\/\/dl.dropbox.com\/s\/mcck683ko4gniuo\/money_stack.png?dl=0" alt="Money">
              <\/div>
              <a class="unset price-assist-product-button" :href="retailer[2]" target="_blank">Product 💰<\/a>
          <\/div>
          <hr class="price-assist-hr">
        <\/div>
    <\/div>

    <footer class="unset" id="price-assist-footer">
      <a target="_blank" href="http:\/\/www.timeless-apps\/track-prices\/index.html">Track Prices<\/a>
        <p>|<\/p>
        <a href="">Save Product<\/a>
    <\/footer>
<\/div>
`
var myscript;
var vue;

let port = chrome.runtime.connect({name:"cs-port"});

url = window.location.toString();
if (url.includes("www.amazon.com") && (url.includes("dp") || url.includes("gp"))) {
    console.log(url)
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
        // This is to remove the "old" iframe and replace it with the new one generated
        if(internal_display_count >= 1) {
            document.getElementById("price-assist-wrapper").remove();
        }

        // The container for the Price Assist GUI
        var priceAssistContainer = document.createElement('div');
        priceAssistContainer.id = "price-assist-container"

        // Add the body to the container
        priceAssistContainer.innerHTML = bodyElements

        // Add the head to the head of the website in order
        document.getElementsByTagName('head')[0].innerHTML += headElements;

        // Put GUI where the left column is
        document.getElementById('imageBlock_feature_div').appendChild(priceAssistContainer);

        // Must create script elements for the script I made and vue
        vue = document.createElement("script");
        myScript = document.createElement("script");
        vue.src = "https:\/\/cdn.jsdelivr.net\/npm\/vue\/dist\/vue.js";
        myScript.src = "https:\/\/dl.dropbox.com\/s\/zvmy6kfsj8d719f\/script.js?dl=0";

        // Add the scripts to the head to begin loading them
        document.getElementsByTagName("head")[0].appendChild(vue);
        document.getElementsByTagName("head")[0].append(myScript);

        // VERY IMPORTANT: Sets the internal_check to "DO NOTHING" so that the if statement will fail
        internal_check = "DO NOTHING";
    }

    if (message.message == "add data") {
        // In order to access the retailerData in the app variable,
        // the script element is injected into the website which will
        // execute the script in it
        let script = document.createElement('script');

        // Iterate through the keys and values in data
        for(const [key, value] of Object.entries(message.data)) {
            // Check if the data is irrelevant
            if ((value[1] == null) || (value[2] == null) || (key == "identifier") || (key == "title")) {

            }
            else {
                // Format to append to the reatilerData list
                let pushData = "['" + value[0] + "', '" + value[1] + "', '" + value[2] + "']"
                script.textContent += "window.app.retailerData.push("+ pushData +");";
            }
        }

        // VERY IMPORTANT: Must wait for the script with the Vue.js
        // instance to load before appending this custom script
        myScript.addEventListener('load', function() {
            document.getElementsByTagName("head")[0].appendChild(script);
        })
    }

    if (message.message == "change visibility") {
        console.log("change visiblity");
        visibility = document.getElementById("iframe-wrapper").style.visibility;
        if (visibility == "visible") {
            document.getElementById("iframe-wrapper").style.setProperty("visibility", "hidden");
        }

        else {
            document.getElementById("iframe-wrapper").style.setProperty("visibility", "visible");
        }
    }

});
