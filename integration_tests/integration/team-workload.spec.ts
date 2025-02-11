import Page from '../pages/page'
import TeamWorkloadPage from '../pages/teamWorkload'

context('Team Workload', () => {
  let teamWorkloadPage

  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.task('stubGetTeamDetails', 'N03F01')
    cy.task('stubForTeamWorkload')
    cy.visit('/team-workload/N03F01')

    teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  })

  it('Team details visible on page', () => {
    teamWorkloadPage.captionText().should('contain', 'Team Name 1')
    teamWorkloadPage.secondaryText().should('contain', 'PO')
  })
})
