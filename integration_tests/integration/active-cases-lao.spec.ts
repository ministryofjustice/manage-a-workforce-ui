import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForStaffLaoStatusByCrnsRestricted')
    cy.task('stubGetOffenderManagerCases')
    cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/TM2/OM2/active-cases')
    activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
  })

  it('Table visible on page', () => {
    activeCasesPage.captionText().should('contain', 'Team Name 1')
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam Armstrong                CRN1111            Restricted access',
          Tier: 'B3',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': '************                CRN2222            Restricted access',
          Tier: 'This is a restricted access case. Check NDelius if you require access or further information.',
        },
      ])
  })
})
