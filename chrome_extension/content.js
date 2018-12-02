/* Override window.alert */
var originalAlert = window.alert;
window.alert = function(s, injected) {
  if (injected) {
    //vulnerability exists
  }

  setTimeout(function() {
    originalAlert('Congratulations, you executed an alert');
  }, 50);
};

function inject() {
  $(':input').each(function(item) {
    console.log(this);
    $(this).val('<script>alert("vulnerable");</script>');
  });

  $('form')[0].submit();
}

function detect() {
  $(':input').each(function(item) {
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
    case 'DETECT':
      detect();
      break;
    case 'INJECT':
      inject();
      break;
    case 'ANALYZE':
      analyze();
      break;
  }
});
