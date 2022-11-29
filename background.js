var domain;
var cookie = {};
var body = [];
// Not sure this listener is right
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var url = new URL(tab.url);
      domain = url.hostname;
      console.log(domain);
      try{
        chrome.cookies.getAll({ domain: domain }, function (cookies) {
          cookies.forEach((item) => {
            cookie[item['name']] = item['value'];
          });
          console.log(`Cookies: ${JSON.stringify(cookie)}`);
        });
      }catch(e){
        console.log(e.message);
      }
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
        try {
          var postedString = decodeURIComponent(
            String.fromCharCode.apply(
              null,
              new Uint8Array(details.requestBody.raw[0].bytes)
            )
          );
          body.push(postedString);
          console.log(`requestBody: ${JSON.stringify(postedString)}`);
        } catch (err) {
          console.log(`Error decoding body ${err.message}`);
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);
