import Page from '../pages/page'
import ForbiddenPage from '../pages/forbidden'

context('Forbidden', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
  })

  it('403 message and header should be shown for lao', () => {
    cy.task('stubForLaoStatus403', { crn: 'J678910' })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view', { failOnStatusCode: false })
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
    forbiddenPage.heading().should('exist')
  })

  it('403 message and header should be shown for Region', () => {
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 403 })
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view', { failOnStatusCode: false })
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
    forbiddenPage.heading().should('exist')
  })
})
