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

document.querySelectorAll('button[data-disable2]').forEach(elem => {
  elem.addEventListener('click', event => {
    // Perform validation before submitting the form
    const form = elem.form
    const value = document.getElementById('instructions').value
    console.info('value =' + value)
    const isValid =
      !/((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g.test(value)

    if (!isValid) {
      console.info('NOT isValid =' + isValid)
      event.preventDefault()
      return
    }
    if (!value || value.trim().length == 0) {
      console.info('empty  value =[' + value + ']')
      event.preventDefault()
      return
    }

    console.info('valid =' + isValid)
    document.querySelectorAll('button[data-disable2]').forEach(item => {
      console.info('disablibg =')
      item.disabled = true
    })

    console.info('submitting =')
    elem.form.submit()
  })
})
