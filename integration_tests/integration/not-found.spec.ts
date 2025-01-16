import Page from '../pages/page'
import NotFoundPage from '../pages/notFound'

context('Not found', () => {
  beforeEach(() => {
    cy.task('stubSetup')
  })

  it('Must show correct body text when 404', () => {
    cy.signIn()
    cy.visit('/unknown', { failOnStatusCode: false })
    const notFoundPage = Page.verifyOnPage(NotFoundPage)
    notFoundPage.bodyText().contains('If you entered a web address, check it is correct.')
    notFoundPage.bodyText().contains('You can go to the homepage to find the information you need.')
  })
})
