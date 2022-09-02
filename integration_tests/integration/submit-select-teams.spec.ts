import AllocateCasesByTeamPage from '../pages/allocate-cases-by-team'
import Page from '../pages/page'
import SelectTeamsPage from '../pages/select-teams'

context('Select teams and show allocate cases by team', () => {
  let allocateCasesByTeamPage

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
            code: 'TM2',
            name: 'Team 2',
          },
          {
            code: 'TM1',
            name: 'Team 1',
          },
        ],
      })
      cy.task('stubPutUserPreferenceTeams')
      cy.task('stubUserPreferenceTeams', ['TM1', 'TM2'])
      cy.signIn()
      cy.visit('/probationDeliveryUnit/PDU1/select-teams')
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

    it('team data displayed in table', () => {
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
      allocateCasesByTeamPage
        .link()
        .should('contain', 'editing your team list')
        .should('have.attr', 'href')
        .and('include', '/PDU1')
    })
  })
})
