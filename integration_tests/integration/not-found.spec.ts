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
    notFoundPage
      .bodyText()
      .contains(
        'If you typed the web address, check it is correct. If you pasted the web address, check you copied the entire address.'
      )
    notFoundPage
      .bodyText()
      .contains('If you see this error frequently, email the Manage a Workforce team with details of the issue.')
  })
})
