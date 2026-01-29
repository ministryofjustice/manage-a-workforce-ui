import Page from '../../pages/page'
import AllocationCompletePage from '../../pages/reallocations/allocationComplete'

context('Reallocate Complete', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubCrnLookup', { crn: 'J678910' })
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
  })

  it('panel visible on page with correct information', () => {
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/TM2/OM2/reallocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case reallocated')
    allocationCompletePage.panelBody().should('contain', 'Jane Doe (J678910) has been reallocated to John Doe (PO)')
    allocationCompletePage
      .bulletedList()
      .should('exist')
      .and('contain', 'this case will be updated in NDelius within 5 minutes')
      .and(
        'contain',
        "John Doe (john.doe@test.justice.gov.uk) has been notified, and we've sent a copy of your reallocation instructions",
      )
  })

  it('panel visible on page with correct information LAO', () => {
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/TM2/OM2/reallocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case reallocated')
    allocationCompletePage.panelBody().should('contain', 'Jane Doe (J678910) has been reallocated to John Doe (PO)')
    allocationCompletePage
      .bulletedList()
      .should('exist')
      .and('contain', 'this case will be updated in NDelius within 5 minutes')
      .and(
        'contain',
        "John Doe (john.doe@test.justice.gov.uk) has been notified, and we've sent a copy of your reallocation confirmation",
      )
  })
})
