function debounce(fn, delay) {
  var timer = null
  return function () {
    var context = this,
      args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

function govukFont(text) {
  return '<span class="govuk-body">' + text + '</span>'
}

function removeNoScriptElements() {
  var noScriptElements = document.getElementsByTagName('noscript')
  for (var i = 0; i < noScriptElements.length; i++) {
    var noScriptElement = noScriptElements.item(i)
    noScriptElement.parentNode.removeChild(noScriptElement)
  }
}

window.addEventListener('load', function () {
  removeNoScriptElements()

  var selectedEmail = null
  var emailInput = document.getElementById('autocomplete')
  var emailList = document.getElementById('govuk-recipient-list')
  var savedEmailList = document.getElementById('govuk-saved-emails-list')
  var saveEmail = document.getElementById('saveEmail')
  var spinners = document.getElementsByClassName('spinner')
  var savedEmailsContainer = document.getElementById('saved-recipients')
  var recipientsContainer = document.getElementById('recipient-list-container')
  const { crn, convictionNumber } = document.getElementById('autocomplete-script').dataset

  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    selectElement: emailInput,
    name: emailInput.name.replace('emailPlaceholder', 'email'),
    confirmOnBlur: false,
    templates: {
      inputValue: function (result) {
        return (result && result.email) ?? ''
      },
      suggestion: function (result) {
        if (result.unableToLoad) {
          return govukFont('This function is unavailable, please try again later')
        }
        if (typeof result === 'string') {
          return govukFont('Clear the selection')
        }
        return (
          result && govukFont(result.email + ' - ' + result.fullName + (result.jobTitle ? ' ' + result.jobTitle : ''))
        )
      },
    },
    minLength: 2,
    source: debounce(function (query, populateResults) {
      var request = new XMLHttpRequest()
      request.open('GET', '/staff-lookup?searchString=' + query, true)
      // Time to wait before giving up fetching the search index
      request.timeout = 2 * 1000
      request.onreadystatechange = function () {
        // XHR client readyState DONE
        if (request.readyState === 4) {
          if (request.status === 200) {
            var response = request.responseText
            var json = JSON.parse(response)
            populateResults(json)
          } else {
            populateResults([{ unableToLoad: true }])
          }
        }
      }
      request.send()
    }, 100),
    onConfirm: function (value) {
      selectedEmail = value
    },
  })

  document.getElementById('add-recipient').addEventListener('click', function (event) {
    event.preventDefault()

    if (selectedEmail === null) {
      return
    }

    addEmail(selectedEmail.email, saveEmail.checked, () => {
      document.getElementById('autocomplete').value = null
      saveEmail.checked = false
      selectedEmail = null
    })
  })

  function addEmail(email, save, onComplete) {
    clearLists()

    const request = new XMLHttpRequest()
    request.open('POST', `/email-recipients/${crn}/${convictionNumber}`)
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    request.onreadystatechange = function () {
      // XHR client readyState DONE
      if (request.readyState === 4) {
        if (request.status === 200) {
          if (onComplete && typeof onComplete === 'function') {
            onComplete()
          }
          loadEmails()
          savedEmailsContainer.classList.remove('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))
          recipientsContainer.classList.remove('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))
        } else {
          savedEmailsContainer.classList.add('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
          recipientsContainer.classList.add('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
        }
      }
    }
    request.send(
      JSON.stringify({
        _csrf: document.querySelector('[name="_csrf"]').value,
        email,
        save,
      }),
    )
  }

  function loadEmails() {
    const request = new XMLHttpRequest()
    request.open('GET', `/email-recipients/${crn}/${convictionNumber}`)

    request.onreadystatechange = function () {
      // XHR client readyState DONE
      if (request.readyState === 4) {
        if (request.status === 200) {
          savedEmailsContainer.classList.remove('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))
          recipientsContainer.classList.remove('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))

          const response = request.responseText
          const json = JSON.parse(response)

          populateSavedEmails(json.saved)
          populateEmails(json.recipients)
        } else {
          savedEmailsContainer.classList.add('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
          recipientsContainer.classList.add('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
          savedEmailsContainer.classList.remove('hidden')
        }

        Array.from(spinners).at(0).classList.add('hidden')
        Array.from(spinners).at(-1).classList.add('hidden')
      }
    }
    request.send()
  }

  function clearLists() {
    savedEmailsContainer.classList.remove('govuk-form-group--error')
    recipientsContainer.classList.remove('govuk-form-group--error')

    Array.from(savedEmailList.children).forEach(child => {
      savedEmailList.removeChild(child)
    })

    Array.from(emailList.children).forEach(child => {
      if (child.dataset.allocatedPractitioner === undefined) {
        emailList.removeChild(child)
      }
    })

    Array.from(spinners).forEach(spinner => {
      spinner.classList.remove('hidden')
    })
  }

  function removeEmail(email, saved) {
    clearLists()

    const request = new XMLHttpRequest()
    request.open('PUT', `/email-recipients/${crn}/${convictionNumber}`)
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    request.onreadystatechange = function () {
      // XHR client readyState DONE
      if (request.readyState === 4) {
        if (request.status === 200) {
          loadEmails()
          savedEmailsContainer.classList.remove('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))
          recipientsContainer.classList.remove('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.add('hidden'))
        } else {
          savedEmailsContainer.classList.add('govuk-form-group--error')
          savedEmailsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
          recipientsContainer.classList.add('govuk-form-group--error')
          recipientsContainer.querySelectorAll('.govuk-error-message').forEach(msg => msg.classList.remove('hidden'))
        }
      }
    }
    request.send(
      JSON.stringify({
        _csrf: document.querySelector('[name="_csrf"]').value,
        email: email,
        saved: saved ?? false,
      }),
    )
  }

  function populateEmails(emails) {
    emails.forEach(e => {
      var newEmailItem = document.createElement('li')
      emailList.appendChild(newEmailItem)

      var newEmail = document.createElement('div')
      newEmail.innerText = e.email
      newEmail.className = 'govuk-body-s new-recipient'
      newEmailItem.appendChild(newEmail)

      var hidden = document.createElement('input')
      hidden.type = 'hidden'
      hidden.name = 'person[]'
      hidden.value = e.email
      newEmail.appendChild(hidden)

      var remove = document.createElement('a')
      remove.className = 'govuk-link'
      remove.innerText = 'Remove email'
      remove.href = '#'

      remove.addEventListener('click', function (event) {
        event.preventDefault()
        removeEmail(e.email)
      })

      newEmail.appendChild(remove)
    })
  }

  function populateSavedEmails(emails) {
    if (emails.length > 0) {
      savedEmailsContainer.classList.remove('hidden')
    } else {
      savedEmailsContainer.classList.add('hidden')
    }

    emails.forEach((e, index) => {
      const li = document.createElement('li')

      const container = document.createElement('div')
      container.className = 'saved-email'

      const checkboxContainer = document.createElement('div')
      checkboxContainer.className = 'govuk-checkboxes__item'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `saved-email-${index}`
      checkbox.className = 'govuk-checkboxes__input'
      checkbox.checked = e.checked

      checkbox.addEventListener('change', event => {
        if (event.target.checked) {
          addEmail(e.email, false, 'foo')
        } else {
          removeEmail(e.email)
        }
      })

      checkboxContainer.appendChild(checkbox)

      const label = document.createElement('label')
      label.className = 'govuk-label govuk-checkboxes__label'
      label.innerText = e.email
      label.htmlFor = `saved-email-${index}`

      checkboxContainer.appendChild(label)

      container.appendChild(checkboxContainer)

      const remove = document.createElement('a')
      remove.className = 'govuk-link'
      remove.innerText = 'Remove from list'
      remove.href = '#'

      remove.addEventListener('click', function (event) {
        event.preventDefault()
        removeEmail(e.email, true)
      })

      container.appendChild(remove)

      li.appendChild(container)

      savedEmailList.appendChild(li)
    })
  }

  if (document.getElementById('autocomplete-script').dataset.scrollToBottom) {
    var autoCompleteInputs = document.getElementsByClassName('autocomplete__input')
    autoCompleteInputs.item(autoCompleteInputs.length - 1).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  clearLists()
  loadEmails()
})
