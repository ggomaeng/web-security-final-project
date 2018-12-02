var lastAction = '';
var templateEngine = '';
var isLoading = false;

function sendMessageToContent(message) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, message, {}, response => {});
  });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message);
}

function reloadPopup() {
  sendMessageToPopup({
    lastAction,
    templateEngine,
    isLoading
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('message', message);
  switch (message.type) {
    case 'DETECT':
      isLoading = true;
      lastAction = message.type;
      sendMessageToContent({ type: 'DETECT' });
      reloadPopup();
      break;
    case 'DETECTED':
      isLoading = false;
      lastAction = message.type;
      templateEngine = message.data;
      reloadPopup();
      break;
    case 'POPUP':
      reloadPopup();
      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    console.log('TAB_LOADED', tabId, tab, changeInfo);
    switch (lastAction) {
      case 'DETECT':
        sendMessageToContent({ type: 'ANALYZE' });
    }
  }
});
