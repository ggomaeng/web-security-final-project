var background = chrome.extension.getBackgroundPage();
sendToBackground({ type: 'POPUP' });

document.getElementById('content-button').addEventListener('click', detect);

function detect() {
  sendToBackground({ type: 'DETECT' });
}

function showLoading() {
  $('#container').hide();
  $('#loading').css({
    display: 'flex',
    'min-height': '320px',
    'justify-content': 'center',
    'align-items': 'center'
  });
}

function hideLoading() {
  $('#container').show();
  $('#loading').hide();
}

function sendToBackground(message) {
  chrome.runtime.sendMessage(message);
}

function sendToContent(message) {
  console.log('sending', message);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function() {
      console.log('message sent');
    });
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('message', message);
  const { lastAction, templateEngine, isLoading } = message;
  if (isLoading) {
    showLoading();
  } else {
    hideLoading();
  }

  switch (lastAction) {
    case 'DETECTED':
      console.log('in last action');
      $('#content-title').text(
        'Congratulations! ' + templateEngine + ' detected.'
      );
      $('#content-img').attr('src', './img/jinja.png');
      $('#content-button').text('Next');
      break;
  }
});
