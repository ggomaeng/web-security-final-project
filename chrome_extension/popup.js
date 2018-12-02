document.getElementById('content-button').addEventListener('click', myFunction);

function myFunction() {
  $('#container').hide();
  showLoading();

  console.log('asd');
}

function showLoading() {
  $('#loading').css({
    display: 'flex',
    'min-height': '320px',
    'justify-content': 'center',
    'align-items': 'center',
    padding: 16
  });
}
