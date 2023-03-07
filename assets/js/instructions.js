makeInstructionsKey = function (crn, convictionNumber) {
  return `instructions-save-${crn}-${convictionNumber}`
}

loadInstructions = function (textArea, newInstructionsItem) {
  if (localStorage[newInstructionsItem]) {
    var storedInstructions = localStorage.getItem(newInstructionsItem)
    try {
      var lastInstructions = JSON.parse(storedInstructions)
      textArea.value = lastInstructions.v
    } catch (e) {
      // log so we can fix
      console.log(`Unable to read item ${key}`)
    }
  }
}

saveInstructions = function (textArea, newInstructionsItem, currentTimeInSeconds) {
  var item = { v: textArea.value, t: currentTimeInSeconds }
  localStorage.setItem(newInstructionsItem, JSON.stringify(item))
}

removeExpiredInstructions = function (timeoutInSeconds, currentTimeInSeconds) {
  for (var i = 0, allStoredInstructions = Object.keys(localStorage); i < allStoredInstructions.length; i++) {
    var key = allStoredInstructions[i]
    var value = localStorage.getItem(key)
    try {
      var storedInstructions = JSON.parse(value)
    } catch (e) {
      // not json - assume old style value
      console.log(`Porting old instructios: ${key}`)
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
