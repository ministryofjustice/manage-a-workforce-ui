$(document).ready(function () {
  const convictionId = $('.allocate').attr('id')
  window.onbeforeunload = function () {
    const instructions = $(`#instructions`).val()
    if ($.trim(instructions) !== '') {
      localStorage.setItem(`instructions-save-${convictionId}`, instructions)
    }
  }
  if (localStorage[`instructions-save-${convictionId}`]) {
    document.getElementById(`instructions`).value = localStorage.getItem(`instructions-save-${convictionId}`)
  }

  $('.allocate').click(function () {
    localStorage.removeItem(`instructions-save-${convictionId}`)
  })
})
