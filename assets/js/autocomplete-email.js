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

  var emailInputs = document.getElementsByClassName('govuk-select')
  for (var i = 0; i < emailInputs.length; i++) {
    var emailInput = emailInputs.item(i)
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
            result &&
            govukFont(
              result.email +
                ' - ' +
                result.firstName +
                ' ' +
                result.lastName +
                (result.jobTitle ? ' ' + result.jobTitle : '')
            )
          )
        },
      },
      minLength: 2,
      source: debounce(function (query, populateResults) {
        var request = new XMLHttpRequest()
        request.open('GET', '/staff-lookup?searchString=' + query, true)
        // Time to wait before giving up fetching the search index
        request.timeout = 2 * 1000
        console.log('Loading search index')
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
    })
  }
  if (document.getElementById('autocomplete-script').dataset.scrollToBottom) {
    var autoCompleteInputs = document.getElementsByClassName('autocomplete__input')
    autoCompleteInputs.item(autoCompleteInputs.length - 1).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
})
