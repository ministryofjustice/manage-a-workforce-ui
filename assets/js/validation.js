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

function test(form, rules, messages, scrollToGroup) {
  const validator = new Validator(serializeForm(form), rules, messages)

  form.querySelectorAll('.govuk-error-message').forEach(error => {
    error.remove()
  })

  form.querySelectorAll('.govuk-form-group').forEach(group => {
    group.classList.remove('govuk-form-group--error')
  })

  if (validator.fails()) {
    Object.entries(validator.errors.all()).forEach(([field, message], index) => {
      const element = form.querySelector(`[name="${toArrayNotation(field)}"]`)

      const group = element.closest('.govuk-form-group')
      group.classList.add('govuk-form-group--error')

      const label = element.type === 'radio' ? group.querySelector('legend') : group.querySelector('label')

      const error = document.createElement('p')
      error.classList.add('govuk-error-message')
      error.innerHTML = `<span class="govuk-visually-hidden">Error: </span> ${message}`
      label ? label.insertAdjacentElement('afterend', error) : element.insertAdjacentElement('beforebegin', error)

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
      !/((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g.test(value)
  )

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
        instructions: 'nourl',
        'person.*.email': 'email',
      },
      {
        email: 'Enter an email address in the correct format, like name@example.com',
        nourl: 'You cannot include links in the allocation notes',
      },
    ],
    'decision-evidence': [
      {
        evidenceText: 'nourl|required|max:3500',
        isSensitive: 'required',
      },
      {
        nourl: 'You cannot include links in the allocation notes',
        'required.evidenceText': 'Enter the reasons for your allocation decision',
        'max.evidenceText': 'Your explanation must be 3500 characters or fewer',
        'required.isSensitive': "Select 'Yes' if this includes sensitive information",
      },
    ],
  }

  document.querySelectorAll('[data-validate-form]').forEach(form => {
    const formId = form.dataset.validateForm

    if (Array.isArray(forms[formId])) {
      bindForm(form, ...forms[formId])
    }
  })
})
