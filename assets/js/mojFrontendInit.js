window.MOJFrontend.initAll()
var $naturalSortableTables = document.querySelectorAll('[data-module="moj-natural-sortable-table"]')
MOJFrontend.nodeListForEach($naturalSortableTables, function ($table) {
  new MOJFrontend.NaturalSortableTable({
    table: $table,
  })
})
