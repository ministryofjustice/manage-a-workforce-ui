// const instructionKeyPrefix = 'instructions-save'
// makeInstructionsKey = function (crn, convictionNumber) {
//   return `${instructionKeyPrefix}-${crn}-${convictionNumber}`
// }

// loadInstructions = function (textArea, newInstructionsItem) {
//   if (localStorage[newInstructionsItem]) {
//     var storedInstructions = localStorage.getItem(newInstructionsItem)
//     try {
//       var lastInstructions = JSON.parse(storedInstructions)
//       textArea.value = lastInstructions.v
//     } catch (e) {
//       // log so we can fix
//       console.log(`Unable to read item ${key}`)
//     }
//   }
// }

// loadInstructions = function (textArea, newInstructionsItem, crn, convictionNumber, token) {
//   fetch(`/store-allocation-notes?crn=${crn}&convictionNumber=${convictionNumber}`, {
//     method: 'GET',
//   })
//     .then(response => response.value)
//     .then(data => {
//       console.log('data coming back:', data)
//       textArea.value = data
//     })
//     .catch(error => {
//       textArea.value = ''
//       console.error('Get error:', error)
//     })

// saveInstructions = function (textArea, newInstructionsItem, currentTimeInSeconds) {
//   var item = { v: textArea.value, t: currentTimeInSeconds }
//   localStorage.setItem(newInstructionsItem, JSON.stringify(item))
//}

// saveInstructions = function (textArea, newInstructionsItem, currentTimeInSeconds, crn, convictionNumber, token) {
//   fetch('/store-allocation-notes', {
//     method: 'POST',
//     body: {
//       crn: crn,
//       convictionNumber: convictionNumber,
//       instructions: textArea.value,
//     },
//   }).catch(error => {
//     console.log('Post error:', error)
//   })
// }

// removeExpiredInstructions = function (timeoutInSeconds, currentTimeInSeconds) {
//   console.log('removing expired instructions')
// var allStoredInstructions = Object.keys(localStorage).filter(key => key.startsWith(instructionKeyPrefix))
// for (var i = 0; i < allStoredInstructions.length; i++) {
//   var key = allStoredInstructions[i]
//   var value = localStorage.getItem(key)
//   try {
//     var storedInstructions = JSON.parse(value)
//   } catch (e) {
//     // not json - assume old style value
//     console.log(`Porting old instructios: ${key}`)
//     var item = { v: value, t: currentTimeInSeconds }
//     localStorage.setItem(key, JSON.stringify(item))
//     continue
//   }
//   try {
//     if ('v' in storedInstructions && 't' in storedInstructions) {
//       var timestamp = storedInstructions.t
//       if (currentTimeInSeconds - timestamp > timeoutInSeconds) {
//         localStorage.removeItem(key)
//         console.log(`Removed item ${key}`)
//       }
//     }
//   } catch (e) {
//     // skip this item
//     console.log(`Unable to remove item ${key}`)
//   }
// }
//   }
// }
