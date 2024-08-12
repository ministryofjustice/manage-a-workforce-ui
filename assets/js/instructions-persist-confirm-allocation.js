// window.addEventListener('load', function () {
//   const FOUR_WEEKS_IN_SECONDS = 4 * 7 * 24 * 3600
//   var currentTimeInSeconds = Math.floor(Date.now() / 1000)
//   //removeExpiredInstructions(FOUR_WEEKS_IN_SECONDS, currentTimeInSeconds)
//   const textArea = document.getElementById('instructions')
//   const crn = textArea.getAttribute('data-crn')
//   const convictionNumber = textArea.getAttribute('data-conviction-number')
//   const newInstructionsItem = makeInstructionsKey(crn, convictionNumber)
//   window.onbeforeunload = function () {
//     saveInstructions(textArea, newInstructionsItem, currentTimeInSeconds, crn, convictionNumber)
//   }
//   loadInstructions(textArea, newInstructionsItem)
// })
