import AllocateCasesByTeamPage from '../pages/allocateCasesByTeam'
import Page from '../pages/page'
import SelectTeamsPage from '../pages/teams'
import ForbiddenPage from '../pages/forbidden'

context('Select teams and show allocate cases by team', () => {
  let allocateCasesByTeamPage: AllocateCasesByTeamPage

  context('Single teams', () => {
    beforeEach(() => {
      cy.task('stubSetup')
      cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
      cy.task('stubGetPduDetails')
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
      cy.visit('/pdu/PDU1/select-teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.continueButton().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('Team selection saved as user preference', () => {
      cy.task('verifyPutUserPreferenceTeams', ['TM1'])
    })

    it('PDU selection saved as user preference', () => {
      cy.task('verifyPutUserPreferencePDU', ['PDU1'])
    })
  })

  context('Multiple teams', () => {
    beforeEach(() => {
      cy.task('stubSetup')
      cy.task('stubGetPduDetails')
      cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
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
      cy.task('stubPutUserPreferenceTeams', ['TM1', 'TM2'])
      cy.task('stubPutUserPreferencePDU', ['PDU1'])
      cy.task('stubUserPreferenceTeams', ['TM1', 'TM2'])
      cy.signIn()
      cy.visit('/pdu/PDU1/select-teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.checkbox('team-2').click()
      selectTeamsPage.continueButton().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('Caption text visible on page', () => {
      allocateCasesByTeamPage.captionText().should('contain', 'A Region')
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
          },
          {
            Name: 'Team 2',
            Workload: '88%',
            Cases: '4',
          },
        ])
    })

    it('Team selection saved as user preference', () => {
      cy.task('verifyPutUserPreferenceTeams', ['TM1', 'TM2'])
    })

    it('PDU selection saved as user preference', () => {
      cy.task('verifyPutUserPreferencePDU', ['PDU1'])
    })

    it('link to edit team list must exist', () => {
      allocateCasesByTeamPage
        .editTeamsLink()
        .should('contain', 'remove them by editing your teams list')
        .should('have.attr', 'href')
        .and('include', '/PDU1')
    })
  })

  context('errors', () => {
    beforeEach(() => {
      cy.task('stubSetup')
      cy.task('stubGetPduDetails')
      cy.task('stubUserPreferenceTeams')
      cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })

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
      cy.task('stubPutUserPreferenceTeamsErrorThenSuccess', ['TM1'])
      cy.task('stubPutUserPreferencePDUErrorThenSuccess', ['PDU1'])
      cy.task('stubUserPreferenceTeams', ['TM1'])
      cy.signIn()
      cy.visit('/pdu/PDU1/select-teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.continueButton().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it('Team selection saved as user preference', () => {
      cy.task('verifyPutUserPreferenceTeams', ['TM1'])
    })

    it('PDU selection saved as user preference', () => {
      cy.task('verifyPutUserPreferencePDU', ['PDU1'])
    })
  })

  context('Forbidden PDU', () => {
    beforeEach(() => {
      cy.task('stubSetup')
      cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
      cy.task('stubGetPduDetails')
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
      cy.visit('/pdu/PDU1/select-teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 403 })

      selectTeamsPage.continueButton().click()
    })

    it('Shows forbidden page', () => {
      const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
      forbiddenPage.message().should('exist')
      forbiddenPage.heading().should('exist')
    })
  })
})
