import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'
// eslint-disable-next-line import/named
import { sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/active-cases')
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
        'You cannot allocate cases to John Doe through the Allocations tool because their email address is not linked to their staff code in NDelius.'
      )
  })

  it('notification banner is visible when officer has no email', () => {
    cy.task('stubGetOffenderManagerCasesNoEmail')
    cy.reload()
    activeCasesPage
      .notificationBanner()
      .should(
        'contain',
        'You cannot allocate cases to John Doe through the Allocations tool because their email address is not linked to their staff code in NDelius.'
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
          'Name / CRN': 'Dylan Adam ArmstrongCRN1111',
          Tier: 'B3',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': 'Cindy SmithCRN2222',
          Tier: 'A0',
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
        // tier sorts by tierOrder which is different to the alpha chars below (which is wy B3 comes before A0)
        orderedData: ['B3', 'A0'],
      },
      {
        columnHeaderName: 'Type of case',
        orderedData: ['Custody', 'License'],
      },
    ]
    sortDataAndAssertSortExpectations(sortExpectations)
  })

  it('persists the sort order when refreshing the page', () => {
    cy.get('table').within(() => cy.contains('button', 'Name / CRN').click())

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))

    cy.reload()

    cy.get('table').within(() => cy.contains('button', 'Name / CRN').should('have.attr', { 'aria-sort': 'ascending' }))
  })
})
