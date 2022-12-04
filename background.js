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
      console.log(`domain: ${domain}`);

      try {
        chrome.cookies.getAll({ domain: domain }, function (cookies) {
          cookies.forEach((item) => {
            cookie[item['name']] = item['value'];
          });
          console.log(`Cookies: ${JSON.stringify(cookie)}`);
        });
      } catch (e) {
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
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toUpperCase();
}

// if base64 encoded?
function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str.trim();
  } catch (err) {
    return false;
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var url = details.url;
    if (details.method == 'POST') {
      if (details.requestBody.raw) {
        console.log(`URL: ${url}`);
        try {
          var postedString = decodeURIComponent(
            String.fromCharCode.apply(
              null,
              new Uint8Array(details.requestBody.raw[0].bytes)
            )
          );
          body.push(postedString);
          var string = body[0];
          console.log(`requestBody: ${JSON.stringify(postedString)}`);
          
          // decode base64encoded string
	  while(isBase64(string)){
	    string = atob(string);
	  }
          // deal with binary
          string = btoa(string);
          var hex = base64ToHex(string);
          console.log(string);
          console.log(hex);
          
          if (hex.indexOf("ACED0005")>-1 && string.indexOf('rO0A') > -1) {
            chrome.tabs.query(
              { active: true, lastFocusedWindow: true },
              function (tabs) {
                const iconData = {
                  tabId: tabs[0].id,
                  path: 'image/shield-yellow.png',
                };
                chrome.action.setIcon(iconData);
                var response = chrome.tabs.sendMessage(tabs[0].id, {
                  greeting: 'hello',
                  deseri_src: 'request body',
                });
              }
            );
          }
        } catch (err) {
          console.log(`Error decoding body ${err.message}`);
        }
      }
      else if (details.requestBody.formData){
        console.log(`URL: ${url}`);
        let formData = details.requestBody.formData;
        let cancel = false;
        try{
          Object.keys(formData).forEach(key => {
            formData[key].forEach(value => {
              // decode base64encoded string
	      while(isBase64(value)){
	        value = atob(value);
	      }
              // deal with binary
              value = btoa(value);
              var hex = base64ToHex(value);
              console.log(key,value);
              console.log(key,hex);
              if (hex.indexOf("ACED0005")>-1 || value.indexOf('rO0A') > -1) {
                cancel = true;
                console.log(123123);
                chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                  function (tabs) {
                    const iconData = {
                    tabId: tabs[0].id,
                    path: 'image/shield-yellow.png',
                  };
                    chrome.action.setIcon(iconData);
                    var response = chrome.tabs.sendMessage(tabs[0].id, {
                      greeting: 'hello',
                      deseri_src: 'request body',
                    });
                 }
                );
              }
            });
          });
          return {cancel: cancel};
        } catch (err){
          console.log(`Error decoding body ${err.message}`);
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);


