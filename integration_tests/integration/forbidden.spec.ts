import Page from '../pages/page'
import ForbiddenPage from '../pages/forbidden'

context('Forbidden', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.task('stubForLaoStatus403', { crn: 'J678910' })
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view', { failOnStatusCode: false })
  })

  it('403 message should be shown', () => {
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
  })

  it('403 header/title should be shown', () => {
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.heading().should('exist')
  })
})
