function update(data, keys, value) {
  if (keys.length === 0) {
    return value
  }

  let key = keys.shift()
  if (!key) {
    data = data || []
    if (Array.isArray(data)) {
      key = data.length
    }
  }
  const index = +key
  if (!isNaN(index)) {
    data = data || []
    key = index
  }
  data = data || {}
  const val = update(data[key], keys, value)
  data[key] = val

  return data
}

function serializeForm(form) {
  return Array.from(new FormData(form).entries()).reduce((data, [field, value]) => {
    let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/)

    if (keys) {
      keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), m => m[1])
      value = update(data[prefix], keys, value)
    }

    return {
      ...data,
      [prefix]: value,
    }
  }, {})
}

function toArrayNotation(field) {
  return field.split('.').reduce((acc, text) => `${acc}[${text}]`)
}

function buildErrorSummary(errors, form) {
  const errorSummary = document.createElement('div')
  errorSummary.classList.add('govuk-error-summary')
  errorSummary.dataset.module = 'govuk-error-summary'

  const errorSummaryAlert = document.createElement('div')
  errorSummaryAlert.setAttribute('role', 'alert')

  const errorSummaryTitle = document.createElement('h2')
  errorSummaryTitle.classList.add('govuk-error-summary__title')
  errorSummaryTitle.innerText = 'There is a problem'

  const errorSummaryBody = document.createElement('div')
  errorSummaryBody.classList.add('govuk-error-summary__body')

  const errorSummaryList = document.createElement('ul')
  errorSummaryList.classList.add('govuk-list')
  errorSummaryList.classList.add('govuk-error-summary__list')

  Object.entries(errors)
    .map(([field, message]) => {
      const element = form.querySelector(`[name="${toArrayNotation(field)}"]`)

      const errorListItem = document.createElement('li')

      const errorLink = document.createElement('a')
      errorLink.setAttribute('href', `#${element.id}`)
      errorLink.innerText = message

      errorListItem.appendChild(errorLink)

      return errorListItem
    })
    .forEach(error => {
      errorSummaryList.appendChild(error)
    })

  errorSummaryBody.appendChild(errorSummaryList)
  errorSummaryAlert.appendChild(errorSummaryTitle)
  errorSummaryAlert.appendChild(errorSummaryBody)
  errorSummary.appendChild(errorSummaryAlert)

  return errorSummary
}

function test(form, rules, messages, scrollToGroup) {
  const validator = new Validator(serializeForm(form), rules, messages)

  form.querySelectorAll('.govuk-error-message').forEach(error => {
    error.remove()
  })

  form.querySelectorAll('.govuk-form-group').forEach(group => {
    group.classList.remove('govuk-form-group--error')
  })

  document.querySelectorAll('.govuk-error-summary').forEach(summary => {
    summary.remove()
  })

  if (validator.fails()) {
    document
      .querySelector('.govuk-main-wrapper')
      .insertAdjacentElement('beforebegin', buildErrorSummary(validator.errors.all(), form))

    Object.entries(validator.errors.all()).forEach(([field, message], index) => {
      const element = form.querySelector(`[name="${toArrayNotation(field)}"]`)

      const group = element.closest('.govuk-form-group')
      group.classList.add('govuk-form-group--error')

      const label = element.type === 'radio' ? group.querySelector('legend') : group.querySelector('label')

      const error = document.createElement('p')
      error.classList.add('govuk-error-message')
      error.innerHTML = `<span class="govuk-visually-hidden">Error: </span> ${message}`
      label ? label.insertAdjacentElement('afterend', error) : group.insertAdjacentElement('afterbegin', error)

      if (index === 0 && scrollToGroup) {
        const { top } = group.getBoundingClientRect()

        window.scrollTo({
          top: top + window.scrollY,
          behavior: 'smooth',
        })
      }
    })

    return false
  }

  return true
}

function bindForm(form, rules, messages) {
  const submit = form.querySelector('[data-form-submit]')

  if (submit) {
    submit.addEventListener('click', event => {
      if (!test(form, rules, messages, true)) {
        event.preventDefault()
      }
    })
  }
}

window.addEventListener('load', () => {
  Validator.register(
    'nourl',
    value =>
      !/((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g.test(value),
  )

  Validator.register('crn', value => /^([a-z]|[A-Z]){1}[0-9]{6}$/g.test(value))

  Validator.register('empty', value => value.length < 1)

  const forms = {
    'case-view': [
      {
        instructions: 'nourl',
      },
      {
        'nourl.instructions': 'You cannot include links in the allocation notes',
      },
    ],
    'confirm-allocation': [
      {
        instructions: 'nourl|required',
        person_placeholder: 'empty',
      },
      {
        empty: 'Find and select a justice.gov.uk email address',
        nourl: 'You cannot include links in the allocation notes',
        'required.instructions': 'Enter allocation notes',
      },
    ],
    'confirm-reallocation': [
      {
        instructions: 'nourl',
        person_placeholder: 'empty',
      },
      {
        empty: 'Find and select a justice.gov.uk email address',
        nourl: 'You cannot include links in the allocation notes',
      },
    ],
    'spo-oversight': [
      {
        instructions: 'nourl|required|max:3500',
      },
      {
        nourl: 'You cannot include links in the spo oversight contact',
        'required.instructions': 'Enter the reasons for your allocation decision',
        'max.instructions': 'Your explanation must be 3500 characters or fewer',
      },
    ],
    'choose-practitioner': [
      {
        instructions: 'nourl',
        allocatedOfficer: 'required',
      },
      {
        required: 'Select a probation practitioner',
        nourl: 'You cannot include links in the allocation notes',
      },
    ],
    'crn-lookup': [
      {
        search: 'crn|required',
      },
      {
        crn: 'Enter a valid CRN to search',
        required: 'Enter a valid CRN to search',
      },
    ],
  }

  document.querySelectorAll('[data-validate-form]').forEach(form => {
    const formId = form.dataset.validateForm

    if (Array.isArray(forms[formId])) {
      bindForm(form, ...forms[formId])
    }

    form.addEventListener('submit', event => {
      document.querySelectorAll('[data-disable]').forEach(elem => {
        elem.disabled = true
      })
    })
  })
})
