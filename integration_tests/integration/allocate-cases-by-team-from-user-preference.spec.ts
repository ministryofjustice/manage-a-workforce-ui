import AllocateCasesByTeamPage from '../pages/allocateCasesByTeam'
import Page from '../pages/page'

context('Show allocate cases by team based on user preferences', () => {
  let allocateCasesByTeamPage: AllocateCasesByTeamPage

  context('single team', () => {
    beforeEach(() => {
      cy.task('stubSetup')
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
      cy.task('stubGetPduDetails')
      cy.signIn()
      cy.visit('/pdu/PDU1/teams')
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
          },
        ])
      cy.get('table')
        .contains('tr', 'Team 1')
        .find('a')
        .should('have.attr', 'href')
        .and('include', '/pdu/PDU1/TM1/team-workload')
    })

    it('link to edit team list must exist', () => {
      allocateCasesByTeamPage
        .editTeamsLink()
        .should('contain', 'remove them by editing your teams list')
        .should('have.attr', 'href')
        .and('include', '/PDU1/select-teams')
    })

    it('link to find unallocated cases must exist', () => {
      allocateCasesByTeamPage.findUnallocatedLink().should('contain.text', 'View unallocated cases')
    })
  })

  context('Edge cases', () => {
    beforeEach(() => {
      cy.task('stubSetup')
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
      cy.task('stubGetPduDetails')
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
      cy.visit('/pdu/PDU1/teams')
      cy.get('table')
        .getTable()
        .should('deep.equal', [
          {
            Name: 'Team 1',
            Workload: '77%',
            Cases: '3',
          },
          {
            Name: 'Team 2',
            Workload: '-%',
            Cases: '-',
          },
        ])
    })

    it('does not display teams if no probation estate teams', () => {
      cy.task('stubGetTeamsByCodes', {
        codes: 'TM1,TM2',
        response: [],
      })
      cy.visit('/pdu/PDU1/teams')
      cy.get('table').getTable().should('deep.equal', [])
    })

    it('does not display teams if no user preferences', () => {
      cy.task('stubUserPreferenceTeams', [])
      cy.visit('/pdu/PDU1/teams')
      cy.get('table').getTable().should('deep.equal', [])
    })
  })
})
