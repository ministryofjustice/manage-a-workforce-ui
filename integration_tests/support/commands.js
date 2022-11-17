Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request(`/`)
  cy.task('getSignInUrl').then(url => cy.visit(url, options))
})

const getTable = (subject, options = {}) => {
  if (subject.get().length > 1) {
    throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)
  }

  const tableElement = subject.get()[0]
  const headers = [...tableElement.querySelectorAll('thead th')].map(e => e.textContent.replace(/\s/g, ' '))

  const rows = [...tableElement.querySelectorAll('tbody tr')].map(row => {
    return [...row.querySelectorAll('td, th')].map(e => e.textContent.replace(/\r?\n|\r|\n/g, '').trim())
  })

  return rows.map(row =>
    row.reduce((acc, curr, index) => {
      if (options.onlyColumns && !options.onlyColumns.includes(headers[index])) {
        return { ...acc }
      }
      return { ...acc, [headers[index]]: curr }
    }, {})
  )
}

const getSummaryList = subject => {
  if (subject.get().length > 1) {
    throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)
  }

  const summaryListElement = subject.get()[0]

  const rows = [...summaryListElement.querySelectorAll('.govuk-summary-list__row')].map(row => {
    const key = row
      .querySelector('.govuk-summary-list__key')
      .textContent.trim()
      .replace(/\s{2,}/g, ' ')
    const value = row
      .querySelector('.govuk-summary-list__value')
      .textContent.replace(/\r?\n|\r|\n/g, '')
      .trim()
      .replace(/\s{2,}/g, ' ')
    return { [key]: value }
  })

  return rows.reduce((acc, curr) => {
    return { ...acc, ...curr }
  }, {})
}

const getCheckBoxes = subject => {
  if (subject.get().length > 1) {
    throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)
  }

  const checkBoxElement = subject.get()[0]
  return [...checkBoxElement.querySelectorAll('.govuk-checkboxes__item')].map(row => {
    const inputValue = row.querySelector('.govuk-checkboxes__input').getAttribute('value')
    const labelValue = row
      .querySelector('.govuk-checkboxes__label')
      .textContent.trim()
      .replace(/\s{2,}/g, ' ')
    return { inputValue, labelValue }
  })
}

const getRadios = subject => {
  if (subject.get().length > 1) {
    throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)
  }

  const radioElement = subject.get()[0]
  return [...radioElement.querySelectorAll('.govuk-radios__item')].map(row => {
    const inputValue = row.querySelector('.govuk-radios__input').getAttribute('value')
    const labelValue = row
      .querySelector('.govuk-radios__label')
      .textContent.trim()
      .replace(/\s{2,}/g, ' ')
    return { inputValue, labelValue }
  })
}

const trimTextContent = subject => {
  if (subject.get().length > 1) {
    throw new Error(`Selector "${subject.selector}" returned more than 1 element.`)
  }

  const element = subject.get()[0]

  return element.textContent.trim().replace(/\s{2,}/g, ' ')
}

Cypress.Commands.add('getTable', { prevSubject: true }, getTable)
Cypress.Commands.add('getSummaryList', { prevSubject: true }, getSummaryList)
Cypress.Commands.add('getCheckBoxes', { prevSubject: true }, getCheckBoxes)
Cypress.Commands.add('getRadios', { prevSubject: true }, getRadios)
Cypress.Commands.add('trimTextContent', { prevSubject: true }, trimTextContent)
