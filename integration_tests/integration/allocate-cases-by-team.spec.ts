import AllocateCasesByTeamPage from '../pages/allocate-cases-by-team'
import Page from '../pages/page'
import SelectTeamsPage from '../pages/select-teams'

context('Select teams', () => {
  let allocateCasesByTeamPage

  context('single team', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
      cy.task('stubGetAllocations')
      cy.task('stubGetTeamsByPdu')
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
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.button().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('team code displayed in table (for now)', () => {
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

  context('Multiple teams', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
      cy.task('stubGetAllocations')
      cy.task('stubGetTeamsByPdu')
      cy.task('stubGetUnallocatedCasesByTeams', {
        teamCodes: 'TM1,TM2',
        response: [
          {
            teamCode: 'TM1',
            caseCount: 1,
          },
          {
            teamCode: 'TM2',
            caseCount: 2,
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
      cy.signIn()
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.checkbox('team-2').click()
      selectTeamsPage.button().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('Caption text visible on page', () => {
      allocateCasesByTeamPage.captionText().should('contain', 'Wales')
    })

    it('Table caption visible on page', () => {
      allocateCasesByTeamPage.tableCaption().should('contain', 'Your teams')
    })

    it('team code displayed in table (for now)', () => {
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
            Action: 'View unallocated cases (2)',
          },
        ])
    })

    it('link to edit team list must exist', () => {
      allocateCasesByTeamPage.link().should('contain', 'editing your team list')
    })
  })

  context('Edge cases', () => {
    let selectTeamsPage
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
      cy.task('stubGetAllocations')
      cy.task('stubGetTeamsByPdu')
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
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.checkbox('team-2').click()
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
      selectTeamsPage.button().click()
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
      selectTeamsPage.button().click()
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
            Action: 'View unallocated cases',
          },
        ])
    })

    it('does not display teams if probation estate does not return teams', () => {
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1,TM2',
        response: [],
      })
      selectTeamsPage.button().click()
      cy.get('table').getTable().should('deep.equal', [])
    })
  })
})
