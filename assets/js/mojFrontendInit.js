window.MOJFrontend.initAll()
var $naturalSortableTables = scope.querySelectorAll('[data-module="moj-natural-sortable-table"]')
MOJFrontend.nodeListForEach($naturalSortableTables, function ($table) {
  new MOJFrontend.NaturalSortableTable({
    table: $table,
  })
})
