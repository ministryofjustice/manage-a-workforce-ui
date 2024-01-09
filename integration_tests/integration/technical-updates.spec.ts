import TechnicalUpdatesPage from '../pages/technicalUpdates'
import Page from '../pages/page'

context('Technical Updates', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/technical-updates')
  })

  it('Technical updates', () => {
    Page.verifyOnPage(TechnicalUpdatesPage)
  })

  it('Caption text visible on page', () => {
    const technicalUpdatesPage = Page.verifyOnPage(TechnicalUpdatesPage)
    technicalUpdatesPage.captionText().should('have.text', 'Allocations')
  })

  it('header visible on page', () => {
    const technicalUpdatesPage = Page.verifyOnPage(TechnicalUpdatesPage)
    technicalUpdatesPage.headingText().should('have.text', 'Technical updates')
  })

  it('send us feedback visible on page', () => {
    const technicalUpdatesPage = Page.verifyOnPage(TechnicalUpdatesPage)
    technicalUpdatesPage.sendFeedback().should('have.text', 'Send us feedback on the Allocations tool')
  })

  it('technical updates banner not visible on page', () => {
    const technicalUpdatesPage = Page.verifyOnPage(TechnicalUpdatesPage)
    technicalUpdatesPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })
})
