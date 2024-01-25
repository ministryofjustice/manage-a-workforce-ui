export interface ColumnSortExpectations {
  columnHeaderName: string
  orderedData: Array<string>
}

export const sortDataAndAssertSortExpectations = (sortExpectations: Array<ColumnSortExpectations>) => {
  let columnNumber = 1
  sortExpectations.forEach(columnSortExpectation => {
    cy.get('table').within(() => cy.contains('button', columnSortExpectation.columnHeaderName).click())

    // check the clicked heading is sorted and all others are not
    cy.get('thead')
      .find('th')
      .each($el => {
        const sort = $el.text() === columnSortExpectation.columnHeaderName ? 'ascending' : 'none'
        cy.wrap($el).should('have.attr', { 'aria-sort': sort })
      })

    // checks data for column is sorted ascending
    let rowNumber = 0
    columnSortExpectation.orderedData.forEach(expectedData => {
      if (expectedData) {
        cy.get(`tr td:nth-child(${columnNumber})`) // gets the 1st column
          .eq(rowNumber) // grabs the 2nd row of that column
          .contains(expectedData) // asserts expectedColumnValue
      }
      rowNumber += 1
    })

    // clicking again sorts in the other direction
    cy.get('table').within(() => cy.contains('button', columnSortExpectation.columnHeaderName).click())
    cy.get('table').within(() =>
      cy.contains('button', columnSortExpectation.columnHeaderName).should('have.attr', { 'aria-sort': 'descending' })
    )

    // checks data for column is sorted descending
    rowNumber = 0
    const orderedDataDescending = columnSortExpectation.orderedData.reverse()
    orderedDataDescending.forEach(expectedData => {
      if (expectedData) {
        cy.get(`tr td:nth-child(${columnNumber})`) // gets the 1st column
          .eq(rowNumber) // grabs the 2nd row of that column
          .contains(expectedData) // asserts expectedColumnValue
      }
      rowNumber += 1
    })

    columnNumber += 1
  })
}
