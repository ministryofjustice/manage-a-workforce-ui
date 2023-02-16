import AllocateCasesByTeamPage from '../pages/allocateCasesByTeam'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('stubSetup')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('redirects to User preference selected PDU Allocate cases by team', () => {
    cy.signIn()
    cy.url().should('include', '/pdu/PDU1/teams')
  })

  it('User can log out', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.signOut().click()
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('User name visible in header', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Feedback link goes to Manage a Workforce mailbox', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage
      .feedbackLink()
      .should('have.attr', 'href')
      .and('equal', 'mailto:manageaworkforce@justice.gov.uk')
  })

  it('Footer visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage
      .footer()
      .should('contain', 'Accessibility statement')
      .and('contain', 'Cookies')
      .and('contain', 'Privacy')
      .and('contain', 'Technical updates')
      .and('contain', 'Open Government Licence v3.0')
      .and('contain', '© Crown copyright')
  })

  it('technical updates banner visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.technicalUpdatesBanner().should('be.visible')
  })
})
