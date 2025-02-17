import { initAll } from '/assets/govuk/govuk-frontend.min.js'
initAll()

document.querySelectorAll('a[data-back]').forEach(elem => {
  elem.addEventListener('click', () => window.history.back())
})

document.querySelectorAll('button[data-disable]').forEach(elem => {
  elem.addEventListener('click', () => {
    document.querySelectorAll('button[data-disable]').forEach(item => {
      item.disabled = true
    })

    elem.form.submit()
  })
})
