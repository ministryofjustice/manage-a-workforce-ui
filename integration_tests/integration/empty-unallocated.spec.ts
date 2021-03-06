import UnallocatedPage from '../pages/unallocated'
import Page from '../pages/page'

context('No unallocated cases', () => {
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

  it('Sub nav link visible on page with no number', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNavLink().should('have.text', 'Unallocated community cases')
  })

  it('Must show no case list information available', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.noCaseParagraph().should('have.text', 'No case list information available.')
  })
})
