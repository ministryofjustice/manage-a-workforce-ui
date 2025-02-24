import { initAll } from '/assets/govuk/govuk-frontend.min.js'
initAll()

document.querySelectorAll('a[data-back]').forEach(elem => {
  elem.addEventListener('click', () => window.history.back())
})
