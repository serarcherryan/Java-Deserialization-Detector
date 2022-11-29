var domain;
var cookie;
var body = [];
// Not sure this listener is right
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            var url = new URL(tab.url)
            domain = url.hostname
            console.log(domain);
            chrome.cookies.get({"url":domain, "name":"RememberMe"}, function(cookies) {
                        console.log("The cookie is");
                        console.log(cookies);
                        
                        cookie = cookies;
                 });
          });

    }
  })

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var fileName = details.url;
      if (details.requestBody) {
        if (details.requestBody.raw) {
            console.log(fileName);
            console.log("-------");
            console.log(details.requestBody);
            body.push(details.requestBody);
        }
      }
    },
    {urls: ["<all_urls>"]},
  ["requestBody"]);