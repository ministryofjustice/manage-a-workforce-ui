import BeforeYouStartPage from '../pages/beforeYouStart'
import Page from '../pages/page'

context('No PDU user preference set', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubUserPreferencePDU', [])
    cy.task('stubGetAllRegions')
    cy.signIn()
    cy.visit('/')
  })

  it('redirects to before you start page', () => {
    const beforeYouStartPage = Page.verifyOnPage(BeforeYouStartPage)
    beforeYouStartPage.headingText().trimTextContent().should('equal', 'Cases that need allocation')
  })

  it('retries if user preferences not found', () => {
    cy.task('stubUserPreferencePDUErrorThenSuccess')
    cy.visit('/')
    const beforeYouStartPage = Page.verifyOnPage(BeforeYouStartPage)
    beforeYouStartPage.headingText().trimTextContent().should('equal', 'Cases that need allocation')
  })
})
