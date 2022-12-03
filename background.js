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

// base64 to hex
function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result.toUpperCase();
}


// if base64 encoded?
function isBase64(str){
    if(str === '' || str.trim() === ''){
        return false;
    }
    try{
        return btoa(atob(str)) == str.trim();
    }catch(err){
        return false;
    }
  }

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
          string  = JSON.stringify(postedString);
          console.log(`requestBody: ${string}`);
          if (string.indexOf("rO0A")>-1){
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
	      var response = chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello", deseri_src: "request body"});
	      ;
	    });
          }
        } catch (err) {
          console.log(`Error decoding body ${err.message}`);
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);
