window.onload = function () {
  const textArea = document.getElementById('instructions')
  const convictionId = textArea.getAttribute('data-conviction-id')
  const crn = textArea.getAttribute('data-crn')
  const convictionNumber = textArea.getAttribute('data-conviction-number')
  const oldInstructionsItem = `instructions-save-${convictionId}`
  const newInstructionsItem = `instructions-save-${crn}-${convictionNumber}`
  window.onbeforeunload = function () {
    localStorage.setItem(newInstructionsItem, textArea.value)
  }
  if (localStorage[newInstructionsItem]) {
    textArea.value = localStorage.getItem(newInstructionsItem)
  } else if (localStorage[oldInstructionsItem]) {
    const currentValue = localStorage.getItem(oldInstructionsItem)
    textArea.value = currentValue
    localStorage.setItem(newInstructionsItem, currentValue)
    localStorage.removeItem(oldInstructionsItem)
  }
}
