import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

context('No unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1', response: [] })
    cy.task('stubCaseAllocationHistoryCount', 20)
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('must show no cases awaiting allocations content when no cases exist', () => {
    findUnallocatedCasesPage.noCasesBody().should('contain.text', 'There are no cases currently awaiting allocation.')
  })
})
