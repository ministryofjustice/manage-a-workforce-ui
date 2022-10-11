import SelectTeamsPage from '../pages/select-teams'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubUserPreferenceTeams', [])
    cy.task('stubGetPduDetails', 'WPTNWS')
    cy.signIn()
    cy.visit('/')
  })

  it('redirects to team selection page', () => {
    cy.url().should('include', '/probationDeliveryUnit/WPTNWS/select-teams')
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })
})
