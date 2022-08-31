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
      cy.task('stubGetUnallocatedCasesByTeams')
      cy.task('stubWorkloadCases')
      cy.signIn()
      cy.visit('/probationDeliveryUnit/PDU1/teams')
      const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
      selectTeamsPage.checkbox('team').click()
      selectTeamsPage.button().click()
      allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    })

    it.only('team code displayed in table (for now)', () => {
      cy.get('table')
        .getTable()
        .should('deep.equal', [
          {
            Name: 'TM1',
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
            Name: 'TM1',
            Workload: '77%',
            Cases: '1',
            Action: 'View unallocated cases (1)',
          },
          {
            Name: 'TM2',
            Workload: '88%',
            Cases: '2',
            Action: 'View unallocated cases (2)',
          },
        ])
    })

    it('link to edit team list must exist', () => {
      allocateCasesByTeamPage.link().should('contain', 'editing your team list')
    })
  })
})
