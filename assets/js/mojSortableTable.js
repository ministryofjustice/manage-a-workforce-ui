class PersistentSortOrder {
  static activate(table) {
    const tablePersistentId = table.dataset.persistentId
    if (tablePersistentId === undefined) {
      console.warn('Table has no data-persistent-id attribute; cannot set up persistent sort order.')
      return
    }
    this.persistCurrentTable(tablePersistentId)
    this.observeAttributeChanges(tablePersistentId)
    const sortOrder = this.fetchSortOrderDTO(tablePersistentId)
    if (sortOrder !== null) {
      this.forceSortOrder(table, sortOrder)
    }
  }
  static generateCurrentTableColumns() {
    const headers = document.querySelectorAll('thead th')
    const currentTableColumns = []
    let columnIndex = 0
    // IE11 doesn't allow us to call `forEach` on NodeListOf<Element>
    Array.prototype.forEach.call(headers, header => {
      const columnDataPersistentId = header.getAttribute('data-persistent-id')
      const columnDataType = header.getAttribute('data-type')
      const columnSortDirection = header.getAttribute('aria-sort')
      currentTableColumns.push({
        columnIndex,
        columnDataPersistentId,
        columnDataType,
        columnSortDirection,
      })
      columnIndex += 1
    })
    return currentTableColumns
  }
  static persistCurrentTable(tablePersistentId) {
    const currentTableColumns = this.generateCurrentTableColumns()
    const currentTable = {
      tablePersistentId: tablePersistentId,
      currentTableColumns: currentTableColumns,
    }
    window.localStorage.setItem('currentTable', JSON.stringify(currentTable))
  }
  static fetchCurrentTablePersistentIdDTO() {
    const key = 'currentTable'
    const serialized = window.localStorage.getItem(key)
    if (serialized === null) {
      return null
    }
    const deserialized = JSON.parse(serialized)
    if (!(typeof deserialized === 'object' && deserialized !== null && 'tablePersistentId' in deserialized)) {
      return null
    }
    // I’m not sure why a cast is necessary; I’d have thought the compiler
    // would allow us to assign directly to a variable of this type given
    // the above check, but no…
    const keyed = deserialized
    if (!(typeof keyed.tablePersistentId === 'string')) {
      return null
    }
    const withTypedValues = {
      tablePersistentId: keyed.tablePersistentId,
      currentTableColumns: keyed.currentTableColumns,
    }
    return withTypedValues
  }
  static createARIASort(from) {
    if (from === 'none' || from === 'ascending' || from === 'descending') {
      return from
    }
    return null
  }
  static observeAttributeChanges(tablePersistentId) {
    const headers = document.querySelectorAll('thead th')
    // IE11 doesn't allow us to call `forEach` on NodeListOf<Element>
    Array.prototype.forEach.call(headers, header => {
      const headerAriaSortAttribute = header.getAttribute('aria-sort')
      if (headerAriaSortAttribute === null) {
        return
      }
      const observer = new MutationObserver(mutationsList => {
        this.headingAttributesChanged(tablePersistentId, mutationsList)
      })
      observer.observe(header, { attributes: true })
    })
  }
  static headingAttributesChanged(tablePersistentId, mutationsList) {
    // IE11 doesn't allow us to call `forEach` on NodeListOf<Element>
    Array.prototype.forEach.call(mutationsList, mutation => {
      if (mutation.type === 'attributes') {
        // All of the table’s headers receive mutation events, so
        // we need to figure out which of these was actually clicked. We do that
        // by finding out which of the columns is sorted (by looking at the
        // headers’ aria-sort attributes).
        const header = mutation.target
        const newAriaSort = this.createARIASort(header.getAttribute('aria-sort'))
        if (newAriaSort === null) {
          console.warn('Unrecognised aria-sort attribute')
          return
        }
        const dataType = header.getAttribute('data-type')
        const columnPersistentId = header.dataset.persistentId
        if (columnPersistentId === undefined) {
          console.warn('Column has no data-persistent-id attribute; cannot persist chosen order.')
          return
        }
        // IE11 doesn't support `.includes`, so we're using `indexOf` here.
        if (['descending', 'ascending'].indexOf(newAriaSort) > -1) {
          this.persistSortOrder(tablePersistentId, columnPersistentId, newAriaSort, dataType)
          this.persistCurrentTable(tablePersistentId)
        }
      }
    })
  }
  static sortOrderLocalStorageKey(tablePersistentId) {
    return `sortOrder:${tablePersistentId}`
  }
  static persistSortOrder(tablePersistentId, columnPersistentId, order, dataType) {
    const key = this.sortOrderLocalStorageKey(tablePersistentId)
    const object = { columnPersistentId, order, dataType }
    window.localStorage.setItem(key, JSON.stringify(object))
  }
  static fetchSortOrderDTO(tablePersistentId) {
    const key = this.sortOrderLocalStorageKey(tablePersistentId)
    const serialized = window.localStorage.getItem(key)
    if (serialized === null) {
      return null
    }
    const deserialized = JSON.parse(serialized)
    if (
      !(
        typeof deserialized === 'object' &&
        deserialized !== null &&
        'columnPersistentId' in deserialized &&
        'order' in deserialized
      )
    ) {
      return null
    }
    // I’m not sure why a cast is necessary; I’d have thought the compiler
    // would allow us to assign directly to a variable of this type given
    // the above check, but no…
    const keyed = deserialized
    if (!(typeof keyed.columnPersistentId === 'string')) {
      return null
    }
    const withTypedValues = {
      columnPersistentId: keyed.columnPersistentId,
      order: this.createARIASort(keyed.order),
      dataType: keyed.dataType,
    }
    if (withTypedValues.order === null) {
      return null
    }
    // Ditto re “not sure why a cast is necessary”
    return withTypedValues
  }
  static forceSortOrder(table, sortOrder) {
    const headers = table.querySelectorAll('thead th')
    let header
    // polyfill for IE11, which doesn't support `.from`
    if (!Array.from) {
      const tempArray = []
      const { length } = headers
      for (let i = 0; i < length; i += 1) {
        tempArray.push(headers[i])
      }
      for (let i = 0; i < tempArray.length; i += 1) {
        if (tempArray[i].dataset.persistentId === sortOrder.columnPersistentId) {
          header = tempArray[i]
          break
        }
      }
    } else {
      header = Array.from(headers).find(aheader => aheader.dataset.persistentId === sortOrder.columnPersistentId)
    }
    if (header === undefined) {
      console.warn("Couldn't find header with persistent ID ", sortOrder.columnPersistentId)
      return
    }
    // Now we find the button for sorting this column, and we programatically click it.
    const buttons = header.querySelectorAll('button[data-index]')
    if (buttons.length === 0) {
      console.warn('No buttons found in header. Not forcing sort order.')
      return
    }
    if (buttons.length > 1) {
      console.warn('Multiple buttons found in header. Not forcing sort order.')
      return
    }
    const button = buttons[0]
    const currentAriaSort = this.createARIASort(header.getAttribute('aria-sort'))
    if (currentAriaSort === null) {
      console.warn('Couldn’t parse current aria-sort attribute')
      return
    }
    const numberOfClicks = this.clickCountToTransition({ fromAriaSort: currentAriaSort, toAriaSort: sortOrder.order })
    for (let i = 0; i < numberOfClicks; i += 1) {
      button.click()
    }
  }
  static clickCountToTransition({ fromAriaSort, toAriaSort }) {
    if (fromAriaSort === toAriaSort) {
      return 0
    }
    if (toAriaSort === 'none') {
      console.warn('Tried to transition from sorted to unsorted, not allowed')
      return 0
    }
    if (fromAriaSort === 'none') {
      return ['ascending', 'descending'].indexOf(toAriaSort) + 1
    }
    return 1
  }
}

$(() => {
  const tables = document.getElementsByTagName('table')
  if (tables.length === 0) {
    console.warn('No tables found in document. Not setting up sortable table.')
    return
  }

  function SortableTable(tableElement) {
    // Calls the SortableTable constructor with `this` as its context
    MOJFrontend.SortableTable.call(this, tableElement)
  }
  SortableTable.prototype = Object.create(MOJFrontend.SortableTable.prototype)

  function sortStringAsc(valueA, valueB) {
    if (valueA < valueB) {
      return -1
    }
    if (valueA > valueB) {
      return 1
    }
    return 0
  }

  function sortStringDesc(valueA, valueB) {
    if (valueB < valueA) {
      return -1
    }
    if (valueB > valueA) {
      return 1
    }
    return 0
  }

  function sortDateAsc(date1String, date2String, dateDataType) {
    const { date1, date2 } = extractAndConvertDates(date1String, date2String, dateDataType)
    if (date1 < date2) {
      return -1
    } else if (date1 > date2) {
      return 1
    }
    return 0
  }

  function sortDateDesc(date1String, date2String, dateDataType) {
    const { date1, date2 } = extractAndConvertDates(date1String, date2String, dateDataType)
    if (date2 < date1) {
      return -1
    }
    if (date2 > date1) {
      return 1
    }
    return 0
  }

  function valueIsSet(value) {
    return value !== undefined && value !== '' && value !== 'N/A'
  }

  function extractAndConvertDates(date1String, date2String, dateDataType) {
    return {
      date1: extractAndConvertDate(date1String, dateDataType),
      date2: extractAndConvertDate(date2String, dateDataType),
    }
  }

  function extractAndConvertDate(dateString, dateDataType) {
    const farInTheFutureDate = Date.parse('3000-01-01')
    if (valueIsSet(dateString)) {
      const extractedDateString = extractDateFromValue(dateString, dateDataType)
      if (extractedDateString) {
        let convertedDate = Date.parse(extractedDateString)
        if (isNaN(convertedDate)) {
          convertedDate = farInTheFutureDate
        }
        return convertedDate
      }
    }
    return farInTheFutureDate
  }

  function extractDateFromValue(value, dateDataType) {
    if (dateDataType === 'DATE_ON_FIRST_LINE') {
      const lines = value.split('\n')
      if (lines.length > 1) {
        return lines[0]
      }
      return undefined
    }
    return value
  }

  function isSortDataTypeADate(dataType) {
    return dataType && (dataType === 'DATE' || dataType === 'DATE_ON_FIRST_LINE')
  }

  function getClickedColumn(columnIndex) {
    let clickedColumn = {
      columnIndex: columnIndex,
      columnDataType: 'string',
    }
    const currentTableDTO = PersistentSortOrder.fetchCurrentTablePersistentIdDTO()
    if (currentTableDTO) {
      const matchingColumns = currentTableDTO.currentTableColumns.filter(
        column => column.columnIndex.toString() === columnIndex
      )
      if (matchingColumns.length > 0) {
        clickedColumn = matchingColumns[0]
      }
    }
    return clickedColumn
  }

  MOJFrontend.SortableTable.prototype.sort = function (rows, columnIndex, sortDirection) {
    const clickedColumn = getClickedColumn(columnIndex, sortDirection)
    const sortDataTypeIsDate = isSortDataTypeADate(clickedColumn.columnDataType)
    var newRows = rows.sort(
      $.proxy(function (rowA, rowB) {
        const tdA = $(rowA).find('td,th').eq(columnIndex)
        const tdB = $(rowB).find('td,th').eq(columnIndex)
        const valueA = this.getCellValue(tdA)
        const valueB = this.getCellValue(tdB)
        if (sortDirection === 'ascending') {
          if (sortDataTypeIsDate) {
            return sortDateAsc(valueA, valueB, clickedColumn.columnDataType)
          } else {
            return sortStringAsc(valueA, valueB)
          }
        } else {
          if (sortDataTypeIsDate) {
            return sortDateDesc(valueA, valueB, clickedColumn.columnDataType)
          } else {
            return sortStringDesc(valueA, valueB)
          }
        }
      }, this)
    )
    return newRows
  }
  SortableTable.prototype.constructor = SortableTable

  Array.from(tables).forEach(function (table) {
    new SortableTable(table)
    PersistentSortOrder.activate(table)
  })
})
