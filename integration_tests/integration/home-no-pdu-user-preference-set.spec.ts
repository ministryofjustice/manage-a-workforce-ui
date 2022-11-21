import RegionPage from '../pages/region'
import Page from '../pages/page'

context('No PDU user preference set', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubUserPreferencePDU', [])
    cy.task('stubGetAllRegions')
    cy.signIn()
    cy.visit('/')
  })

  it('redirects to region selection page', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.legendHeading().trimTextContent().should('equal', 'Select your region')
  })

  it('retries if user preferences not found', () => {
    cy.task('stubUserPreferencePDUErrorThenSuccess')
    cy.visit('/')
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.legendHeading().trimTextContent().should('equal', 'Select your region')
  })
})
