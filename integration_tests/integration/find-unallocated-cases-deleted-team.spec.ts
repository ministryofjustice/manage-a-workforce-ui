import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'
import SelectTeamsPage from '../pages/teams'

context('Find Unallocated cases', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceEmptyAllocationDemand')
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    cy.task('stubCaseAllocationHistoryCount', 20)
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })

    cy.signIn()
    cy.visit('/pdu/PDU1/find-unallocated')
    Page.verifyOnPage(FindUnallocatedPage)
  })

  it('old team code selected in user preference redirects to select teams page', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'OLDTEAM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'OLDTEAM1' })
    cy.task('stubGetTeamsByCodes', {
      codes: 'OLDTEAM1',
      response: [],
    })
    cy.reload()
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })
})
