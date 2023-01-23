import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

context('No unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1', response: [] })
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('must show no cases awaiting allocations content when no cases exist', () => {
    findUnallocatedCasesPage.noCasesBody().should('contain.text', 'There are no cases currently awaiting allocation.')
  })
})
