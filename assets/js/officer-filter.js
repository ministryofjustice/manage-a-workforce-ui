$(function () {
  $('.govuk-tabs__tab').on('click', function (event) {
    var { teamCode } = event.target.dataset
    $('#team-tabs .govuk-tabs__list-item').toggleClass('govuk-tabs__list-item--selected', false)
    $(this).parent().toggleClass('govuk-tabs__list-item--selected', true)

    $('#practitioners-table tbody tr').each(function () {
      var $row = $(this)
      if (teamCode && $row.has(`td[data-team-code="${teamCode}"]`).length) {
        $row.toggleClass('govuk-visually-hidden', false)
      } else if (teamCode) {
        $row.toggleClass('govuk-visually-hidden', true)
      } else {
        $row.toggleClass('govuk-visually-hidden', false)
      }
    })
  })
})
