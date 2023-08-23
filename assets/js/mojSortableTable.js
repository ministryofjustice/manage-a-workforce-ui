class PersistentSortOrder {
  static activate(table) {
    const tablePersistentId = table.dataset.persistentId
    if (tablePersistentId === undefined) {
      console.warn('Table has no data-persistent-id attribute; cannot set up persistent sort order.')
      return
    }
    this.observeAttributeChanges(tablePersistentId)
    const sortOrder = this.fetchSortOrderDTO(tablePersistentId)
    if (sortOrder !== null) {
      this.forceSortOrder(table, sortOrder)
    }
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
        const columnPersistentId = header.dataset.persistentId
        if (columnPersistentId === undefined) {
          console.warn('Column has no data-persistent-id attribute; cannot persist chosen order.')
          return
        }
        // IE11 doesn't support `.includes`, so we're using `indexOf` here.
        if (['descending', 'ascending'].indexOf(newAriaSort) > -1) {
          this.persistSortOrder(tablePersistentId, columnPersistentId, newAriaSort)
        }
      }
    })
  }
  static localStorageKey(tablePersistentId) {
    return `sortOrder:${tablePersistentId}`
  }
  static persistSortOrder(tablePersistentId, columnPersistentId, order) {
    const key = this.localStorageKey(tablePersistentId)
    const object = { columnPersistentId, order }
    window.localStorage.setItem(key, JSON.stringify(object))
  }
  static fetchSortOrderDTO(tablePersistentId) {
    const key = this.localStorageKey(tablePersistentId)
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
  if (tables.length > 1) {
    console.warn('Multiple tables found in document. Not setting up sortable table.')
    return
  }
  const table = tables[0]
  class SortableTable extends MOJFrontend.SortableTable {
    constructor(tableElement) {
      super({ table: tableElement })
    }
    // overrides MOJFrontend.SortableTable.sort function
    sort(rows, columnNumber, sortDirection) {
      return super.sort(rows, columnNumber, sortDirection)
    }
  }
  // eslint-disable-next-line no-new
  new SortableTable(table)
  PersistentSortOrder.activate(table)
})
