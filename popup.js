async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function updateTextAndLogo(text) {
  let str = `Warning! Java Deserialized Sequence Detected in ${text}`;
  document.getElementById('text').innerHTML = str;
  document.getElementById('logo').src = './image/shield-yellow.png';
}

async function getPossibleTextFromContentScript() {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { greeting: 'popup' }, (response) => {
    if (response.text != '') updateTextAndLogo(response.text);
  });
}

getPossibleTextFromContentScript();
