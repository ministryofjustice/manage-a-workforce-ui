window.addEventListener('load', () => {
  const FOUR_WEEKS_IN_SECONDS = 4 * 7 * 24 * 3600
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)

  removeExpiredNotes(FOUR_WEEKS_IN_SECONDS)

  const textArea = document.querySelector('[name="reallocationNotes"]')
  const reason = document.querySelector('[name="reason"]')
  const crn = textArea.getAttribute('data-crn')
  const newNotesItem = makeNotesKey(crn)

  window.addEventListener('beforeunload', () => {
    saveNotes(textArea, reason, newNotesItem, currentTimeInSeconds)
  })

  loadNotes(textArea, reason, newNotesItem)
})
