window.addEventListener('load', function () {
  var currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const textArea = document.getElementById('reallocationNotes')
  const crn = textArea.getAttribute('data-crn')
  const newNotesItem = makeNotesKey(crn)
  window.onbeforeunload = function () {
    saveNotes(textArea, newNotesItem, currentTimeInSeconds)
  }
  loadNotes(textArea, newNotesItem)
})
