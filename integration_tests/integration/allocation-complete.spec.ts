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
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    cy.get('#instructions-123456789').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.notificationsBadge().should('contain', 10)
  })

  it('return to unallocated cases link exists', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    cy.get('#instructions-123456789').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .returnToUnallocatedLink()
      .should('have.text', 'Return to unallocated cases')
      .and('have.attr', 'href', '/')
  })

  it('panel visible on page with correct information', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    cy.get('#instructions-123456789').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage
      .panelBody()
      .should('have.text', '\n    Dylan Adam Armstrong (J678910) has been allocated to John Doe (PO)\n  ')
  })
})
