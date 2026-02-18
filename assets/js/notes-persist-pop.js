window.addEventListener('load', function () {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const textArea = document.querySelector('[name="reallocationNotes"]')
  const reason = document.querySelector('[name="reason"]')
  const crn = textArea.getAttribute('data-crn')
  const newNotesItem = makeNotesKey(crn)

  window.addEventListener('pagehide', () => {
    saveNotes(textArea, reason, newNotesItem, currentTimeInSeconds)
  })

  loadNotes(textArea, reason, newNotesItem)
})
