import { initAll } from '/assets/govuk/govuk-frontend.min.js'
import { validateForm } from './validation.js'

initAll()

document.querySelectorAll('a[data-back]').forEach(elem => {
  elem.addEventListener('click', () => window.history.back())
})

document.querySelectorAll('button[data-disable]').forEach(elem => {
  elem.addEventListener('click', event => {
    // Perform validation before submitting the form
    const form = elem.form
    const isValid = validateForm(form)

    if (!isValid) {
      event.preventDefault()
      return
    }

    document.querySelectorAll('button[data-disable]').forEach(item => {
      item.disabled = true
    })

    form.submit()
  })
})
