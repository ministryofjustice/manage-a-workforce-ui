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

window.onload = function () {
  var emailInputs = document.getElementsByClassName('govuk-select')
  console.log('this function ran')
  for (var i = 0; i < emailInputs.length; i++) {
    console.log('in loop at ' + i)
    var emailInput = emailInputs.item(i)
    accessibleAutocomplete.enhanceSelectElement({
      defaultValue: '',
      selectElement: emailInput,
      name: emailInput.name,
      confirmOnBlur: false,
      minLength: 2,
      source: debounce(function (query, populateResults) {
        populateResults(['Loading'])
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
              console.log('Failed to load the search index')
              populateResults(['Unable to load options'])
            }
          }
        }
        request.send()
      }, 100),
    })
  }
}
