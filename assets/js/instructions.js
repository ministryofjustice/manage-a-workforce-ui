$(document).ready(function () {
  const convictionId = $('.allocate').attr('id')
  const instructionsItem = `instructions-save-${convictionId}`
  window.onbeforeunload = function () {
    localStorage.setItem(instructionsItem, document.getElementById(`instructions`).value)
  }
  if (localStorage[instructionsItem]) {
    document.getElementById(`instructions`).value = localStorage.getItem(instructionsItem)
  }
})
