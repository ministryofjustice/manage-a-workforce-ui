import UnallocatedPage from '../pages/unallocated'
import Page from '../pages/page'

context('No unallocated cases', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetAllocations', [])
    cy.signIn()
  })

  it('Sub nav link visible on page with no number', () => {
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNavLink().should('have.text', 'Unallocated community cases')
  })

  it('Must show no case list information available', () => {
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.noCaseParagraph().should('have.text', 'No case list information available.')
  })
})
