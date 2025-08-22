const input = document.getElementById('instructions')
const _csrf = document.querySelector('input[name="_csrf"]').value

instructions.addEventListener(
  'keyup',
  debounce(event => saveInput(event)),
)

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function saveInput(event) {
  const { crn, convictionNumber } = input.dataset

  fetch(`/notes/${crn}/${convictionNumber}`, {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({
      _csrf: _csrf,
      instructions: event.target.value || '',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
}
