import Page from '../pages/page'
import AllocationCompletePage from '../pages/allocation-complete'

context('Allocate Complete', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Notification badge visible on page with number of unallocations', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    cy.get('#instructions-123456789').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.notificationsBadge().should('contain', 10)
  })
})
