import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'

import { ColumnSortExpectations, sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrns')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/OM2/active-cases')
    activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
  })

  it('Officer details visible on page', () => {
    activeCasesPage.captionText().should('contain', 'Team Name 1')
    activeCasesPage.secondaryText().should('contain', 'PO')
  })

  it('Back link is visible on page', () => {
    activeCasesPage.backLink().should('contain', 'Back')
  })

  it('notification banner is not visible when officer has an email', () => {
    activeCasesPage
      .notificationBannerHeading()
      .should(
        'not.contain',
        'You cannot allocate cases to John Doe through the Allocations tool because their email address is not linked to their staff code in NDelius.',
      )
  })

  it('notification banner is visible when officer has no email', () => {
    cy.task('stubGetOffenderManagerCasesNoEmail')
    cy.reload()
    activeCasesPage
      .notificationBanner()
      .should(
        'contain',
        'You cannot allocate cases to John Doe through the Allocations tool because their email address is not linked to their staff code in NDelius.',
      )
  })

  it('notification banner to inform of service issues is visible when toggled on', () => {
    activeCasesPage.notificationBanner().should('exist')
    activeCasesPage
      .notificationBannerHeading()
      .should('contain', 'The service is experiencing technical issues, and you may have limited access.')
  })

  it('Heading is visible on page', () => {
    activeCasesPage.heading().should('contain', 'Active cases')
  })

  it('Active cases tab is highlighted', () => {
    activeCasesPage.highlightedTab().should('contain.text', 'Active cases').and('not.contain.text', 'Overview')
  })

  it('Table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam Armstrong            CRN1111',
          Tier: 'B',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': 'Cindy Smith            CRN2222',
          Tier: 'A',
          'Type of case': 'License',
        },
      ])
  })

  it('should show which column the table is currently sorted by', () => {
    const sortExpectations = [
      {
        columnHeaderName: 'Name / CRN',
        orderedData: ['CRN111', 'CRN222'],
      },
      {
        columnHeaderName: 'Tier',
        orderedData: ['A', 'B'],
      },
      {
        columnHeaderName: 'Type of case',
        orderedData: ['Custody', 'License'],
      },
    ]
    sortDataAndAssertSortExpectations(1, sortExpectations, false)
  })

  it('persists the sort order when refreshing the page', () => {
    cy.get('table').within(() => cy.contains('button', 'Name / CRN').click())

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))

    cy.reload()

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))
  })
})

context('New tier system', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrnsNewTiers')
    cy.task('stubGetOffenderManagerCasesForAllTiers')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/OM2/active-cases')
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
    ]
  }
})
