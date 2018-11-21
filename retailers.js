var internal_check = ""
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("GOT THIS FAR");
        if(request.status == "Edit" && internal_check != "Once") {
            internal_check = "Once";
        }
    }
);
