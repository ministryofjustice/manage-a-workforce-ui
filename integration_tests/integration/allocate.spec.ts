import Page from '../pages/page'
import AllocatePage from '../pages/allocate'

context('Allocate', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })
})
