import AllocateCasesByTeamPage from '../pages/allocate-cases-by-team'
import AuthSignInPage from '../pages/authSignIn'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('redirects to North Wales Allocate cases by team', () => {
    cy.signIn()
    cy.url().should('include', '/probationdeliveryunit/WPTNWS/teams')
  })

  it('User can log out', () => {
    cy.signIn()
    const allocateCasesByTeamPage = new AllocateCasesByTeamPage()
    allocateCasesByTeamPage.signOut().click()
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('User name visible in header', () => {
    cy.signIn()
    const allocateCasesByTeamPage = new AllocateCasesByTeamPage()
    allocateCasesByTeamPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Feedback link goes to Manage a Workforce mailbox', () => {
    cy.signIn()
    const allocateCasesByTeamPage = new AllocateCasesByTeamPage()
    allocateCasesByTeamPage
      .feedbackLink()
      .should('have.attr', 'href')
      .and('equal', 'mailto:manageaworkforce@justice.gov.uk')
  })

  it('Footer visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = new AllocateCasesByTeamPage()
    allocateCasesByTeamPage
      .footer()
      .should('contain', 'Accessibility statement')
      .and('contain', 'Cookies')
      .and('contain', 'Privacy')
      .and('contain', 'Open Government Licence v3.0')
      .and('contain', '© Crown copyright')
  })
})
