import Page from '../pages/page'
import ActiveCasesPage from '../pages/reallocationActiveCases'
import { ColumnSortExpectations, sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrns')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForFeatureflagEnabled')
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/reallocations/cases/OM2')
    activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
  })

  it('Officer details visible on page', () => {
    activeCasesPage.captionText().should('contain', 'Team Name 1')
    activeCasesPage.secondaryText().should('contain', 'PO')
  })

  it('Heading is visible on page', () => {
    activeCasesPage.heading().should('contain', 'Active cases')
  })

  it('Table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam Armstrong            CRN1111',
          Tier: 'B',
          'Type of case': 'Custody',
          'Date of initial allocation': '',
          Reallocate: 'Reallocate',
        },
        {
          'Name / CRN': 'Cindy Smith            CRN2222',
          Tier: 'A',
          'Type of case': 'License',
          'Date of initial allocation': '17 May 2025',
          Reallocate: 'Reallocate',
        },
      ])
  })
})

context('New tier system', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrnsNewTiers')
    cy.task('stubGetOffenderManagerCasesForAllTiers')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForFeatureflagEnabled')
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/reallocations/cases/OM2')
  })

  it('should display the label for missing tiers', () => {
    cy.get('table').within(() => cy.contains('button', 'Tier').click())
    cy.get('table').within(() => cy.contains('button', 'Tier').should('have.attr', { 'aria-sort': 'ascending' }))
    cy.get('table').within(() => cy.contains('button', 'Tier').click())
    cy.get('table').within(() => cy.contains('button', 'Tier').should('have.attr', { 'aria-sort': 'descending' }))

    cy.get('table')
      .find('tr td:nth-child(2)') // gets the tier column
      .eq(0) // grabs the first row of that column
      .contains('-') // asserts dash for missing tier
      .should('have.attr', 'aria-label', 'cannot be calculated because assessment data is missing') // asserts expectedColumnValue
  })

  it('should correctly sort the new tiers', () => {
    cy.get('table').within(() => cy.contains('button', 'Tier').click())
    cy.get('table').within(() => cy.contains('button', 'Tier').should('have.attr', { 'aria-sort': 'ascending' }))

    const sortExpectations = generateSortExpectations()
    sortDataAndAssertSortExpectations(1, sortExpectations, false)
  })

  const generateSortExpectations = (): Array<ColumnSortExpectations> => {
    return [
      {
        columnHeaderName: 'Name / CRN',
        orderedData: [
          // we order by CRN not name in this column
          'C567654',
          'CRN1111',
          'CRN2222',
          'E124321',
          'F5635632',
          'L786545',
          'P567654',
          'X768522',
        ],
      },
      {
        columnHeaderName: 'Tier',
        orderedData: ['A', 'B', 'C', 'D', 'E', 'F', 'G', '-'],
      },
      {
        columnHeaderName: 'Type of case',
        orderedData: ['Community', 'Community', 'Community', 'Community', 'Custody', 'Custody', 'Custody', 'License'],
      },
      {
        columnHeaderName: 'Date of initial allocation',
        orderedData: [
          '10 May 2021',
          '15 June 2021',
          '1 September 2021',
          '25 March 2022',
          '23 July 2023',
          '1 March 2024',
          'Invalid Date',
          'Invalid Date',
        ],
      },
    ]
  }
})
