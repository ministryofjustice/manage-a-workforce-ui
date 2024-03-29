window.addEventListener('load', function () {
  var currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const textArea = document.getElementById('instructions')
  const crn = textArea.getAttribute('data-crn')
  const convictionNumber = textArea.getAttribute('data-conviction-number')
  const newInstructionsItem = makeInstructionsKey(crn, convictionNumber)
  window.onbeforeunload = function () {
    saveInstructions(textArea, newInstructionsItem, currentTimeInSeconds)
  }
  loadInstructions(textArea, newInstructionsItem)
})
