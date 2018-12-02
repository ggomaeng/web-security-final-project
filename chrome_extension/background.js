var lastAction = 'DETECT';
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
  isLoading = false;
  switch (message.type) {
    case 'DETECT':
      isLoading = true;
      lastAction = message.type;
      sendMessageToContent({ type: 'CONTENT_DETECT' });
      break;
    case 'DETECTED':
      lastAction = message.type;
      templateEngine = message.data;
      break;

    case 'INJECT':
      lastAction = message.type;
      break;
  }
  reloadPopup();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    console.log('TAB_LOADED', tabId, tab, changeInfo);
    switch (lastAction) {
      case 'DETECT':
        sendMessageToContent({ type: 'CONTENT_ANALYZE' });
    }
  }
});
