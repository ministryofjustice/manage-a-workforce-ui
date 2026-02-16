window.addEventListener('load', function () {
  var currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const textArea = document.querySelector('[name="reallocationNotes"]')
  const reason = document.querySelector('[name="reason"]')
  const crn = textArea.getAttribute('data-crn')
  const newNotesItem = makeNotesKey(crn)
  window.onbeforeunload = function () {
    saveNotes(textArea, reason, newNotesItem, currentTimeInSeconds)
  }
  loadNotes(textArea, reason, newNotesItem)
})
