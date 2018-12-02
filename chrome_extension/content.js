/* Override window.alert */
var originalAlert = window.alert;
window.alert = function(s) {
  sendMessageToBackground({ type: 'INJECTED' });

  setTimeout(function() {
    originalAlert('Congratulations, you executed an alert');
  }, 50);
};

function inject() {
  const inputs = $(':input');
  if (inputs && inputs.length == 0) {
    console.log('NO INPUT BOXES');
    originalAlert('No valid input boxes found.');
    sendMessageToBackground({ type: 'ERROR' });
    return;
  }

  inputs.each(function() {
    console.log(this);
    $(this).val(
      '<script>alert("This page is vulnerable to injection.")</script>'
    );
  });

  $('form')[0].submit();
}

function detect() {
  const inputs = $(':input');
  if (inputs && inputs.length == 0) {
    originalAlert('No valid input boxes found.');
    sendMessageToBackground({ type: 'ERROR' });
    return;
  }

  inputs.each(function() {
    console.log(this);
    $(this).val(`{{7 * '7'}}`);
  });

  $('form')[0].submit();
}

function analyze() {
  const txt = $('body').text();
  if (txt.indexOf('49') > -1) {
    sendMessageToBackground({ type: 'DETECTED', data: 'TWIG' });
  } else if (txt.indexOf('7777777') > -1) {
    sendMessageToBackground({ type: 'DETECTED', data: 'JINJA' });
  }
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('msg received', message.type);
  switch (message.type) {
    case 'ALERT':
      alert(message.data, true);
      break;
    case 'CONTENT_DETECT':
      detect();
      break;
    case 'CONTENT_INJECT':
      inject();
      break;
    case 'CONTENT_ANALYZE':
      analyze();
      break;
  }
});
