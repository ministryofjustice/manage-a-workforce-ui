import UnallocatedPage from '../pages/unallocated'
import Page from '../pages/page'

context('No unallocated cases', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
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
