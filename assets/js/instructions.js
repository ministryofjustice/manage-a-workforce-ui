window.onload = function () {
  const textArea = document.getElementById('instructions')
  const convictionId = textArea.getAttribute('data-conviction-id')
  const instructionsItem = `instructions-save-${convictionId}`
  window.onbeforeunload = function () {
    localStorage.setItem(instructionsItem, textArea.value)
  }
  if (localStorage[instructionsItem]) {
    textArea.value = localStorage.getItem(instructionsItem)
  }
}
