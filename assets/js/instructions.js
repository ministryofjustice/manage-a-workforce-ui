window.addEventListener('load', function () {
  const FOUR_WEEKS_IN_SECONDS = 4 * 7 * 24 * 3600
  var currentTimeInSeconds = Math.floor(Date.now() / 1000)
  removeExpiredInstructions(FOUR_WEEKS_IN_SECONDS, currentTimeInSeconds)
  const textArea = document.getElementById('instructions')
  const crn = textArea.getAttribute('data-crn')
  const convictionNumber = textArea.getAttribute('data-conviction-number')
  const newInstructionsItem = `instructions-save-${crn}-${convictionNumber}`
  window.onbeforeunload = function () {
    var item = { v: textArea.value, t: currentTimeInSeconds }
    localStorage.setItem(newInstructionsItem, JSON.stringify(item))
  }
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
})

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
