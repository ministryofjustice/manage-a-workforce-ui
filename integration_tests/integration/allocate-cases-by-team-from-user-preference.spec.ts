import AllocateCasesByTeamPage from '../pages/allocate-cases-by-team'
import Page from '../pages/page'

context('Show allocate cases by team based on user preferences', () => {
  let allocateCasesByTeamPage

  context('single team', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
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

    it('link to edit team list must exist', () => {
      allocateCasesByTeamPage
        .link()
        .should('contain', 'editing your team list')
        .should('have.attr', 'href')
        .and('include', '/PDU1')
    })

    it('link to view unallocated cases must exist', () => {
      allocateCasesByTeamPage.tableLink('TM1').should('equal', '/team/TM1/cases/unallocated')
    })
  })

  context('Edge cases', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
      cy.task('stubGetAllocations')
      cy.task('stubUserPreferenceTeams', ['TM1', 'TM2'])
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1,TM2',
        response: [
          {
            code: 'TM1',
            name: 'Team 1',
          },
          {
            code: 'TM2',
            name: 'Team 2',
          },
        ],
      })
      cy.task('stubWorkloadCases', {
        teamCodes: 'TM1,TM2',
        response: [
          {
            teamCode: 'TM1',
            totalCases: 3,
            workload: 77,
          },
          {
            teamCode: 'TM2',
            totalCases: 4,
            workload: 88,
          },
        ],
      })
      cy.task('stubGetUnallocatedCasesByTeams', {
        teamCodes: 'TM1,TM2',
        response: [
          {
            teamCode: 'TM1',
            caseCount: 1,
          },
          {
            teamCode: 'TM2',
            caseCount: 6,
          },
        ],
      })
      cy.signIn()
    })

    it('returning no workload for team still displays it', () => {
      cy.task('stubWorkloadCases', {
        teamCodes: 'TM1,TM2',
        response: [
          {
            teamCode: 'TM1',
            totalCases: 3,
            workload: 77,
          },
        ],
      })
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      cy.get('table')
        .getTable()
        .should('deep.equal', [
          {
            Name: 'Team 1',
            Workload: '77%',
            Cases: '3',
            Action: 'View unallocated cases (1)',
          },
          {
            Name: 'Team 2',
            Workload: '-%',
            Cases: '-',
            Action: 'View unallocated cases (6)',
          },
        ])
    })

    it('returning no allocations for team still displays it', () => {
      cy.task('stubGetUnallocatedCasesByTeams', {
        teamCodes: 'TM1,TM2',
        response: [
          {
            teamCode: 'TM1',
            caseCount: 1,
          },
        ],
      })
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      cy.get('table')
        .getTable()
        .should('deep.equal', [
          {
            Name: 'Team 1',
            Workload: '77%',
            Cases: '3',
            Action: 'View unallocated cases (1)',
          },
          {
            Name: 'Team 2',
            Workload: '88%',
            Cases: '4',
            Action: 'View unallocated cases (0)',
          },
        ])
    })

    it('does not display teams if no probation estate teams', () => {
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1,TM2',
        response: [],
      })
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      cy.get('table').getTable().should('deep.equal', [])
    })

    it('does not display teams if no user preferences', () => {
      cy.task('stubUserPreferenceTeams', [])
      cy.task('stubGetUnallocatedCasesByTeams', {
        teamCodes: 'N03F01',
        response: [
          {
            teamCode: 'N03F01',
            caseCount: 10,
          },
        ],
      })
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      cy.get('table').getTable().should('deep.equal', [])
    })
  })
})
