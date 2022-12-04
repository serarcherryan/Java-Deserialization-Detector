// insert some styles into the current tab once the document is loaded
function insert_style(source) {
  try {
    var result = document.getElementById('alert_info');
    if (result && result.style.visibility == 'hidden') {
      result.childNodes[1].textContent = 'Source: ' + source;
      result.style.visibility = 'visible';
    } else if (result && result.style.visibility == 'visible') return;
  } catch (e) {
    console.log(e);
  }
  //create a div on the current tab to show the image
  result = document.createElement('div');
  result.id = 'alert_info';
  result.style.width = '40%';
  result.style.height = '40%';
  result.style.top = '0px';
  result.style.right = '0px';
  result.style.backgroundColor = 'darkseagreen';
  result.style.position = 'fixed';
  result.style.zIndex = '100000';
  result.style.fontSize = '25px';

  var pTitle = document.createTextNode(
    'Warning! Java Deserialized Sequence Detected!\n\n'
  );
  result.appendChild(pTitle);

  var pDescription = document.createTextNode('Source: ' + source);
  result.appendChild(pDescription);

  result.addEventListener('click', function () {
    result.style.visibility = 'hidden';
  });
  document.body.appendChild(result);
}
let text = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting === 'hello') {
    insert_style(request.deseri_src);
    text = request.deseri_src;
  }else if(request.greeting === 'popup') {
    return {text};
  }
});
