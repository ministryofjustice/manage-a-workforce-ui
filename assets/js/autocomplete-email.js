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
//  - What to do when adding another - currently shows the same thing and doesn't work?!
//   ..2 issues:
//   - "Add another" is from moJ JS and duplicates ids
//   - We must call "accessibleAutocomplete.enhanceSelectElement" for the new element - how is that done?
//  - Does validation work (server-side) - it does for the old version (try d@b)? Currently i get errors in the fieldset?!
//  - It will select "no results" or "unable to load options" if you go away from the UI
//  - Can randomly select an option if you clear the box and go away and come back
//  - There is a confusing delay when you start typing - and it shows "No results found" before the actual value
accessibleAutocomplete.enhanceSelectElement({
  defaultValue: '',
  selectElement: document.querySelector('#person\\[0\\]\\[email\\]'),
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
