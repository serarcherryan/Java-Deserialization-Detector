var domain;
var cookie;
var body = [];
// Not sure this listener is right
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var url = new URL(tab.url);
      domain = url.hostname;
      console.log(domain);
      chrome.cookies.getAll({ domain: domain }, function (cookies) {
        console.log('The cookie is');
        console.log(cookies);
        cookie = cookies;
      });
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var url = details.url;
    if (details.method == 'POST') {
      if (details.requestBody.raw) {
        console.log(`URL: ${url}`);
        console.log('-------');
        console.log(`requestBody: ${JSON.stringify(details.requestBody)}`);
        var postedString = decodeURIComponent(
          String.fromCharCode.apply(
            null,
            new Uint8Array(details.requestBody.raw[0].bytes)
          )
        );
        console.log('PS: ' + postedString);
        // body.push(details.requestBody);
        body.push(postedString);
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

