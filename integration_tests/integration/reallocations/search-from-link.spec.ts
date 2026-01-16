import Page from '../../pages/page'
import ReallocationsSearchPage from '../../pages/reallocations/search'
import AllocateCasesByTeamPage from '../../pages/allocateCasesByTeam'

context('Reallocations Search', () => {
  let reallocationsSearchPage
  let allocateCasesByTeamPage: AllocateCasesByTeamPage

  context('Single teams', () => {
    beforeEach(() => {
      cy.task('stubSetup')
      cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
      cy.task('stubGetPduDetails')
      cy.task('stubUserPreferenceTeams')
      cy.task('stubForFeatureflagEnabled')

      cy.task('stubGetUnallocatedCasesByTeams', {
        teamCodes: 'TM1',
        response: [
          {
            teamCode: 'TM1',
            caseCount: 1,
          },
        ],
      })
      cy.task('stubWorkloadCases', {
        teamCodes: 'TM1',
        response: [
          {
            teamCode: 'TM1',
            totalCases: 3,
            workload: 77,
          },
        ],
      })
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1',
        response: [
          {
            code: 'TM2',
            name: 'Team 2',
          },
        ],
      })
      cy.task('stubPutUserPreferenceTeams', ['TM1'])
      cy.task('stubPutUserPreferencePDU', ['PDU1'])
      cy.task('stubUserPreferenceTeams', ['TM1'])
      cy.signIn()
      cy.visit('/pdu/PDU1/teams')
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
      allocateCasesByTeamPage.reallocationLink().click()
    })

    it('Link in footer should take us to rellocation page', () => {
      reallocationsSearchPage = Page.verifyOnPage(ReallocationsSearchPage)
      reallocationsSearchPage.search().should('contain.text', 'You can search by CRN')
    })
  })
})
