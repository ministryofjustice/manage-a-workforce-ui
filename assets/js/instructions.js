window.onload = function () {
  const textArea = document.getElementById('instructions')
  const crn = textArea.getAttribute('data-crn')
  const convictionNumber = textArea.getAttribute('data-conviction-number')
  const newInstructionsItem = `instructions-save-${crn}-${convictionNumber}`
  window.onbeforeunload = function () {
    localStorage.setItem(newInstructionsItem, textArea.value)
  }
  if (localStorage[newInstructionsItem]) {
    textArea.value = localStorage.getItem(newInstructionsItem)
  }
}
