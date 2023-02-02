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
// TODO:
//  - Do not subkit on pressing return
//  - Correct styling
//  - What to do when adding another - currently shows the same thing?!
//  - When selecting 1 it shows 2 boxes?
//  - What does it do when there is an error?
accessibleAutocomplete.enhanceSelectElement({
  defaultValue: '',
  // TODO - will this work for all text boxes?
  selectElement: document.querySelector('#person\\[0\\]\\[email\\]'),
  source: debounce(function (query, populateResults) {
    var request = new XMLHttpRequest()
    request.open('GET', '/staff-lookup?searchString=' + query, true)
    // Time to wait before giving up fetching the search index
    request.timeout = 10 * 1000
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
        }
      }
    }
    request.send()
  }, 300),
})

$(function () {
  $('.js-email-submit').on('click', function () {
    if (!$.trim($('.autocomplete__input').val()).length) {
      $('.js-email-select').val('')
    }
  })
})
