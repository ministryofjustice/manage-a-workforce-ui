$(document).ready(function () {
  window.onbeforeunload = function () {
    const instructions = $('#instructions').val()
    if ($.trim(instructions) !== '') {
      localStorage.setItem('instructions-save', instructions)
    }
  }
  if (localStorage['instructions-save']) {
    document.getElementById('instructions').value = localStorage.getItem('instructions-save')
  }
})
