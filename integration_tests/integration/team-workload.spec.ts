import Page from '../pages/page'
import TeamWorkloadPage from '../pages/teamWorkload'

context('Team Workload', () => {
  let teamWorkloadPage

  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.task('stubGetTeamDetails', { code: 'N03F01', name: 'Team Name 1' })
    cy.task('stubForTeamWorkload')
    cy.visit('/team-workload/N03F01')

    teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  })

  it('Team details visible on page', () => {
    teamWorkloadPage.captionText().should('contain', 'A Probation Delivery Unit')
    teamWorkloadPage.heading().should('contain', 'Team Name 1')
    teamWorkloadPage.mediumHeading().should('contain', 'Workload')
  })

  it('calculates the correct total cases and average workload', () => {
    teamWorkloadPage.totalCases().should('contain.text', '210')
    teamWorkloadPage.averageWorkload().should('contain.text', '75%')
    teamWorkloadPage.averageWorkload().should('have.class', 'under-capacity')
  })

  it('shows the right number of rows in the table', () => {
    teamWorkloadPage.teamTableRows().should('have.length', 14)
    teamWorkloadPage.teamTableRows().first().should('contain.text', 'Coco Pint')
    teamWorkloadPage.teamTableRows().first().should('contain.text', 'PO')
  })

  it('adds the over-capacity class to average workload', () => {
    cy.task('stubForTeamWorkloadOverCapacity')
    cy.visit('/team-workload/N03F01')

    teamWorkloadPage.averageWorkload().should('have.class', 'over-capacity')
  })
})
