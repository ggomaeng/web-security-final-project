function showOverlay(imageUrl) {
  var e = document.getElementById('overlay');
  var b = document.getElementById('closeButton');
  if (e) {
    e.parentNode.removeChild(e);
  }
  if (b) {
    b.parentNode.removeChild(b);
  }

  var img = document.createElement('img');
  img.setAttribute('id', 'overlay');
  img.setAttribute(
    'style',
    'position: fixed; width: 100%; height: 100%; left: 0px; top: 0px; pointer-events: none;'
  );
  img.setAttribute('src', imageUrl);
  console.log('img', img);
  document.body.appendChild(img);

  var button = document.createElement('div');
  button.innerText = 'Close Overlay';
  button.setAttribute('id', 'closeButton');
  button.setAttribute(
    'style',
    `position: fixed; top: 16px; right: 16px; 
    border-style: solid;
    border-width: 2px; background: white; padding: 16px; border-radius: 24px;`
  );

  button.onclick = function() {
    var o = document.getElementById('overlay');
    o.parentNode.removeChild(o);
    var b = document.getElementById('closeButton');
    b.parentNode.removeChild(b);
  };

  document.body.appendChild(button);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, imageUrl } = request.args;

  if (action == 'SHOW_OVERLAY') {
    showOverlay(imageUrl);
  }
});
