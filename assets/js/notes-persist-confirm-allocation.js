window.addEventListener('load', function () {
  const FOUR_WEEKS_IN_SECONDS = 4 * 7 * 24 * 3600
  var currentTimeInSeconds = Math.floor(Date.now() / 1000)
  removeExpiredNotes(FOUR_WEEKS_IN_SECONDS, currentTimeInSeconds)
  const textArea = document.getElementById('reallocationNotes')
  const reason = document.getElementById('reason').value()
  const crn = textArea.getAttribute('data-crn')
  const newNotesItem = makeNotesKey(crn)
  window.onbeforeunload = function () {
    saveNotes(textArea, reason, newNotesItem, currentTimeInSeconds)
  }
  loadNotes(textArea, reason, newNotesItem)
})
