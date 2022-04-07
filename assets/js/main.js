$(document).ready(function () {
  window.onbeforeunload = function () {
    if ($.trim($('#instructions').val()) !== '') {
      localStorage.setItem('instructions-save', $('#instructions').val())
    }
  }
  if (localStorage['instructions-save']) {
    document.getElementById('instructions').value = localStorage.getItem('instructions-save')
  }
})
