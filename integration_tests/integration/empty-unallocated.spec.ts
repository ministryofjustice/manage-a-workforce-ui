import UnallocatedPage from '../pages/unallocated'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetNoAllocations')
  })

  it('Must not show the notifications badge when no unallocated cases exist', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.notificationsBadge().should('not.exist')
  })
})
