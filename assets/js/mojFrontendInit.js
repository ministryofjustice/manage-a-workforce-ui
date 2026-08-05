// Initialise MOJ Frontend components (except SortableTable which is handled in mojSortableTable.js)
// We need to manually initialise components since we override SortableTable initialisation
if (typeof window.MOJFrontend !== 'undefined' && typeof window.MOJFrontend.initAll === 'function') {
  window.MOJFrontend.initAll()
}

// Initialise natural sortable tables if they exist
var $naturalSortableTables = document.querySelectorAll('[data-module="moj-natural-sortable-table"]')
if (typeof MOJFrontend !== 'undefined' && typeof MOJFrontend.NaturalSortableTable === 'function') {
  if (typeof MOJFrontend.nodeListForEach === 'function') {
    MOJFrontend.nodeListForEach($naturalSortableTables, function ($table) {
      new MOJFrontend.NaturalSortableTable({
        table: $table,
      })
    })
  } else {
    // Fallback for versions that don't have nodeListForEach
    Array.from($naturalSortableTables).forEach(function ($table) {
      new MOJFrontend.NaturalSortableTable({
        table: $table,
      })
    })
  }
}
