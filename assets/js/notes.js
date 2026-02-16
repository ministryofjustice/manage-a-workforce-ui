const notesKeyPrefix = 'reallocation-notes-save'

const makeNotesKey = crn => `${notesKeyPrefix}-${crn}`

const loadNotes = (textArea, reason, newNotesItem) => {
  if (!textArea || !newNotesItem) return

  const storedItem = localStorage.getItem(newNotesItem)
  if (!storedItem) return

  try {
    const lastInstructions = JSON.parse(storedItem)
    if (lastInstructions.v) {
      const savedValues = JSON.parse(lastInstructions.v)

      textArea.value = savedValues.instructions || textArea.value

      if (reason) reason.value = savedValues.reason || reason.value
    }
  } catch (e) {
    console.log(`Unable to read item ${newNotesItem}:`, e)
  }
}

const saveNotes = (textArea, reason, newNotesItem) => {
  if (!textArea || !newNotesItem) return

  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const instructionsValue = textArea.value || ''
  const reasonValue = reason ? reason.value : ''
  const values = JSON.stringify({ instructions: instructionsValue, reason: reasonValue })
  const item = { v: values, t: currentTimeInSeconds }

  localStorage.setItem(newNotesItem, JSON.stringify(item))
}

const removeExpiredNotes = timeoutInSeconds => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const keys = Object.keys(localStorage).filter(key => key.startsWith(notesKeyPrefix))

  keys.forEach(key => {
    const value = localStorage.getItem(key)
    if (!value) return

    try {
      const stored = JSON.parse(value)
      if (stored.v && stored.t) {
        if (currentTimeInSeconds - stored.t > timeoutInSeconds) {
          localStorage.removeItem(key)
          console.log(`Removed expired notes: ${key}`)
        }
      }
    } catch (e) {
      // If old style value, port it
      console.log(`Porting old notes: ${key}`)
      localStorage.setItem(key, JSON.stringify({ v: value, t: currentTimeInSeconds }))
    }
  })
}
