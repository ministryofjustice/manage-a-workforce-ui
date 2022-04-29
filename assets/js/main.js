$(document).ready(function () {
  const convictionId = $('.allocate').attr('id')
  window.onbeforeunload = function () {
    const instructions = $(`#instructions-${convictionId}`).val()
    if ($.trim(instructions) !== '') {
      localStorage.setItem(`instructions-save-${convictionId}`, instructions)
    }
  }
  if (localStorage[`instructions-save-${convictionId}`]) {
    document.getElementById(`instructions-${convictionId}`).value = localStorage.getItem(
      `instructions-save-${convictionId}`
    )
    $('.allocate').click = clearLocalStorage()
  }

  function clearLocalStorage() {
    const localStorage = localStorage.getItem(`instructions-save-${convictionId}`)
    localStorage.clear()
  }
})
