import AllocateCasesByTeamPage from '../pages/allocate-cases-by-team'
import Page from '../pages/page'

context('Show allocate cases by team based on user preferences', () => {
  let allocateCasesByTeamPage

  context('single team', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
      cy.task('stubGetAllocations')
      cy.task('stubUserPreferenceTeams')
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
            totalCases: 2,
            workload: 77,
          },
        ],
      })
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1',
        response: [
          {
            code: 'TM1',
            name: 'Team 1',
          },
        ],
      })
      cy.signIn()
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('team data displayed in table', () => {
      cy.get('table')
        .getTable()
        .should('deep.equal', [
          {
            Name: 'Team 1',
            Workload: '77%',
            Cases: '2',
            Action: 'View unallocated cases (1)',
          },
        ])
    })
  })

})
