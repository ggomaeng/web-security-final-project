let screenshotDictionary = {};
let screenshotInterval = null;

function takeScreenshot(cb) {
  chrome.tabs.captureVisibleTab(null, {}, image => {
    if (!image) {
      clearInterval(screenshotInterval);
      return;
    }

    cb(image);
  });
}

function getURL(cb) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    var url = tabs[0].url;
    cb(url);
  });
}

function validateURL(url) {
  return url && (url.indexOf('http://') > -1 || url.indexOf('https://') > -1);
}

function startWatching(tabId) {
  getURL(url => {
    console.log('url', url);
    if (validateURL(url)) {
      if (!screenshotInterval) {
        screenshotInterval = setInterval(() => {
          takeScreenshot(image => {
            console.log('screenshot took for', url, tabId);
            screenshotDictionary[tabId] = {
              image
            };
          });
        }, 1000);
      }
    }
  });
}

function showOverlay(tabId, imageUrl) {
  chrome.tabs.sendMessage(
    tabId,
    { args: { action: 'SHOW_OVERLAY', imageUrl } },
    {},
    response => {}
  );
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    console.log('TAB_LOADED', tabId, tab, changeInfo);
    startWatching(tabId);
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  const { tabId } = activeInfo;
  console.log('TAB_CHANGED', tabId);

  clearInterval(screenshotInterval);
  screenshotInterval = null;

  //only compare if the screenshot exists in the map
  if (screenshotDictionary[tabId]) {
    takeScreenshot(image => {
      const img1 = screenshotDictionary[tabId].image;
      const img2 = image;

      console.log('should compare');
      var diff = resemble(img1)
        .compareTo(img2)
        .onComplete(function(data) {
          console.log(data);
          var icon;
          if (data.misMatchPercentage < 10) {
            icon = { tabId: tabId, path: { '24': 'img/green.png' } };
          } else if (data.misMatchPercentage < 40) {
            icon = { tabId: tabId, path: { '24': 'img/yellow.png' } };
            confirm('Your tab might have been nabbed!');
          } else {
            icon = { tabId: tabId, path: { '24': 'img/red.png' } };
          }

          chrome.browserAction.setIcon(icon, function() {
            if (chrome.runtime.lastError) {
              console.log(tabId + 'no longer exists');
              return;
            }
          });

          const imageUrl = data.getImageDataUrl();
          showOverlay(tabId, imageUrl);
        });
    });
  }
});
