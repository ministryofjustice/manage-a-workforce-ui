const notesKeyPrefix = 'reallocation-notes-save'
makeNotesKey = function (crn) {
  return `${notesKeyPrefix}-${crn}`
}

loadNotes = function (textArea, reason, newNotesItem) {
  if (localStorage[newNotesItem]) {
    var storedInstructions = localStorage.getItem(newNotesItem)
    try {
      var lastInstructions = JSON.parse(storedInstructions)

      if (lastInstructions.v.length > 0) {
        var savedValues = JSON.parse(lastInstructions.v)
        textArea.value = savedValues.instructions
        reason.value = savedValues.reason
      }
    } catch (e) {
      // log so we can fix
      console.log(`Unable to read item ${newNotesItem}`)
    }
  }
}

saveNotes = function (textArea, reason, newNotesItem, currentTimeInSeconds) {
  if (!textArea || !reason) {
    return
  }
  const instructionsValue = textArea.value || ''
  const reasonValue = reason.value || ''
  var values = JSON.stringify({ instructions: instructionsValue, reason: reasonValue })
  var item = { v: values, t: currentTimeInSeconds }
  localStorage.setItem(newNotesItem, JSON.stringify(item))
}

removeExpiredNotes = function (timeoutInSeconds, currentTimeInSeconds) {
  var allStoredInstructions = Object.keys(localStorage).filter(key => key.startsWith(notesKeyPrefix))
  for (var i = 0; i < allStoredInstructions.length; i++) {
    var key = allStoredInstructions[i]
    var value = localStorage.getItem(key)
    try {
      var storedInstructions = JSON.parse(value)
    } catch (e) {
      // not json - assume old style value
      console.log(`Porting old instructions: ${key}`)
      var item = { v: value, t: currentTimeInSeconds }
      localStorage.setItem(key, JSON.stringify(item))
      continue
    }
    try {
      if ('v' in storedInstructions && 't' in storedInstructions) {
        var timestamp = storedInstructions.t
        if (currentTimeInSeconds - timestamp > timeoutInSeconds) {
          localStorage.removeItem(key)
          console.log(`Removed item ${key}`)
        }
      }
    } catch (e) {
      // skip this item
      console.log(`Unable to remove item ${key}`)
    }
  }
}
