import AllocateCasesByTeamPage from '../pages/allocateCasesByTeam'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
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

  it('Feedback link goes to Smart Survey survey', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.surveyLink().should('have.attr', 'href').and('contain', 'www.smartsurvey.co.uk/s/AWQG5Z')
  })

  it('Footer visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage
      .footer()
      .should('contain', 'Accessibility statement')
      .and('contain', 'Cookies')
      .and('contain', 'Privacy')
      .and('contain', "What's new")
      .and('contain', 'Open Government Licence v3.0')
      .and('contain', '© Crown copyright')
  })

  it('technical updates banner visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.technicalUpdatesBanner().should('be.visible')
  })

  it('technical updates banner no longer visible after clicking hide message', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.hideMessageLink().click()
    allocateCasesByTeamPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })

  it('feedback prompt visible on page', () => {
    cy.signIn()
    const allocateCasesByTeamPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    allocateCasesByTeamPage.feedbackPrompt().should('contain', 'Is this page useful?')
    allocateCasesByTeamPage
      .feedbackYes()
      .should('have.attr', 'href')
      .and('contain', 'https://www.smartsurvey.co.uk/s/WQFIXP')
    allocateCasesByTeamPage
      .feedbackNo()
      .should('have.attr', 'href')
      .and('contain', 'https://www.smartsurvey.co.uk/s/DDLZ5O')
  })
})
