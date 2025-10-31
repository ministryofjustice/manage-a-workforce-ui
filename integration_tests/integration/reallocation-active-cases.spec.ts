import Page from '../pages/page'
import ActiveCasesPage from '../pages/reallocationActiveCases'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrns')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
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
      .eq(1)
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam Armstrong            CRN1111',
          Tier: 'B3',
          'Type of case': 'Custody',
          'Date of initial allocation': '',
          Reallocate: 'Reallocate',
        },
        {
          'Name / CRN': 'Cindy Smith            CRN2222',
          Tier: 'A0',
          'Type of case': 'License',
          'Date of initial allocation': '17 May 2025',
          Reallocate: 'Reallocate',
        },
      ])
  })
})
