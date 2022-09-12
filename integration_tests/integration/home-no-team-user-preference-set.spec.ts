import SelectTeamsPage from '../pages/select-teams'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubUserPreferenceTeams', [])
    cy.task('stubGetTeamsByPdu', 'WPTNWS')
    cy.signIn()
    cy.visit('/')
  })

  it('redirects to team selection page', () => {
    cy.url().should('include', '/probationDeliveryUnit/WPTNWS/select-teams')
    const selectTeamsPage = new SelectTeamsPage()
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })
})
