import AuthSignInPage from '../pages/authSignIn'
import UnallocatedByTeamPage from '../pages/unallocated-by-team'

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

  it('redirects to Wrexham team 1', () => {
    cy.signIn()
    cy.url().should('include', '/team/N03F01/cases/unallocated')
  })

  it('User can log out', () => {
    cy.signIn()
    const unallocatedPage = new UnallocatedByTeamPage('Wrexham - Team 1')
    unallocatedPage.signOut().click()
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('User name visible in header', () => {
    cy.signIn()
    const unallocatedPage = new UnallocatedByTeamPage('Wrexham - Team 1')
    unallocatedPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Feedback link goes to Manage a Workforce mailbox', () => {
    cy.signIn()
    const unallocatedPage = new UnallocatedByTeamPage('Wrexham - Team 1')
    unallocatedPage.feedbackLink().should('have.attr', 'href').and('equal', 'mailto:manageaworkforce@justice.gov.uk')
  })

  it('Footer visible on page', () => {
    cy.signIn()
    const unallocatedPage = new UnallocatedByTeamPage('Wrexham - Team 1')
    unallocatedPage
      .footer()
      .should('contain', 'Accessibility statement')
      .and('contain', 'Cookies')
      .and('contain', 'Privacy')
      .and('contain', 'Open Government Licence v3.0')
      .and('contain', '© Crown copyright')
  })
})
