export interface ColumnSortExpectations {
  columnHeaderName: string
  orderedData: Array<string>
}

export const sortDataAndAssertSortExpectations = (
  firstSortableColumnNumber: number,
  sortExpectations: Array<ColumnSortExpectations>,
  isMultiTabTable: boolean,
) => {
  const normaliseHeaderText = (headerText: string) => headerText.replace(/\s+/g, ' ').trim()
  const getTargetTable = () => (isMultiTabTable === true ? cy.get('table').eq(0) : cy.get('table').first())

  let columnNumber = firstSortableColumnNumber
  sortExpectations.forEach(columnSortExpectation => {
    getTargetTable().within(() => cy.contains('button', columnSortExpectation.columnHeaderName).click())

    // check the clicked heading is sorted and all others are not
    getTargetTable()
      .find('thead')
      .find('th')
      .each($el => {
        const sort = normaliseHeaderText($el.text()) === columnSortExpectation.columnHeaderName ? 'ascending' : 'none'
        cy.wrap($el).should('have.attr', { 'aria-sort': sort })
      })

    // checks data for column is sorted ascending
    let rowNumber = 0
    columnSortExpectation.orderedData.forEach(expectedData => {
      if (expectedData) {
        getTargetTable()
          .find(`tr td:nth-child(${columnNumber})`) // gets the requested column
          .eq(rowNumber) // grabs the 2nd row of that column
          .contains(expectedData) // asserts expectedColumnValue
      }
      rowNumber += 1
    })

    // clicking again sorts in the other direction
    getTargetTable().within(() => cy.contains('button', columnSortExpectation.columnHeaderName).click())
    getTargetTable().within(() =>
      cy
        .contains('th[aria-sort] button', columnSortExpectation.columnHeaderName)
        .parent('th')
        .should('have.attr', { 'aria-sort': 'descending' }),
    )

    // checks data for column is sorted descending
    rowNumber = 0
    const orderedDataDescending = [...columnSortExpectation.orderedData].reverse()
    orderedDataDescending.forEach(expectedData => {
      if (expectedData) {
        getTargetTable()
          .find(`tr td:nth-child(${columnNumber})`) // gets the requested column
          .eq(rowNumber) // grabs the 2nd row of that column
          .contains(expectedData) // asserts expectedColumnValue
      }
      rowNumber += 1
    })

    columnNumber += 1
  })
}
