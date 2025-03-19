import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'
// eslint-disable-next-line import/named
import { sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrnsRestricted')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/OM2/active-cases')
    activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
  })

  it('Table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongCRN1111  Restricted access',
          Tier: 'B3',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': '************CRN2222  Restricted access',
          Tier: 'This is a restricted access case. Check NDelius if you require access or further information.',
        },
      ])
  })
})
