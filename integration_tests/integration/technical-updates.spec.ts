import TechnicalUpdatesPage from '../pages/technicalUpdates'
import Page from '../pages/page'

context('Technical Updates', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/whats-new')
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
    technicalUpdatesPage.headingText().should('have.text', 'What’s new')
  })

  it('technical updates banner not visible on page', () => {
    const technicalUpdatesPage = Page.verifyOnPage(TechnicalUpdatesPage)
    technicalUpdatesPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })
})
