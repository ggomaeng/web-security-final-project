var background = chrome.extension.getBackgroundPage();
sendToBackground({ type: 'POPUP' });

function detect() {
  sendToBackground({ type: 'DETECT' });
}

function inject() {
  sendToBackground({ type: 'INJECT' });
}

function reset() {
  sendToBackground({ type: 'RESET' });
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
    case 'DETECT':
      $('#content-button').off();
      $('#content-button').on('click', function() {
        detect();
      });
      break;

    case 'DETECTED':
      $('#content-title').text(
        'Congratulations! ' + templateEngine + ' detected.'
      );
      $('#content-img').attr('src', './img/jinja.png');
      $('#content-button').text('Next');

      $('#content-button').off();
      $('#content-button').on('click', function() {
        $('#content-title').text('Step 2. Inject Scripts');
        $('#content-img').attr('src', './img/icons8-syringe.png');
        $('#content-button').text('Inject');

        $('#content-button').off();
        $('#content-button').on('click', function() {
          inject();
        });
      });
      break;

    case 'INJECT':
      $('#content-title').text('Step 2. Inject Scripts');
      $('#content-img').attr('src', './img/icons8-syringe.png');
      $('#content-button').text('Inject');

      $('#content-button').off();
      $('#content-button').on('click', function() {
        inject();
      });
      break;

    case 'INJECTED':
      $('#content-title').text('THIS SITE IS VULNERABLE TO INJECTION');
      $('#content-img').attr('src', './img/icons8-self_destruct_button.png');
      $('#content-button').text('DONE');

      $('#content-button').off();
      $('#content-button').on('click', function() {
        $('#content-title').text('Step 1. Detect Framework');
        $('#content-img').attr('src', './img/icons8-detective.png');
        $('#content-button').text('Detect');
        $('#content-button').off();
        reset();
      });
      break;
  }
});
