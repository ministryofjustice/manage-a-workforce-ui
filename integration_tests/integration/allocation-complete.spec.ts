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
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.notificationsBadge().should('contain', 8)
  })

  it('return to unallocated cases link exists', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
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
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage
      .panelBody()
      .should('have.text', '\n    Dylan Adam Armstrong (J678910) has been allocated to John Doe (PO)\n  ')
  })

  it('What happens next content visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
    cy.get('#person\\[0\\]\\[email\\]').type('example.admin@justice.gov.uk')
    cy.get('.moj-add-another__add-button').click()
    cy.get('#person\\[1\\]\\[email\\]').type('example.admin@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails')
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage.mediumHeading().should('have.text', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should('contain', 'this case will be updated in NDelius within 5 minutes')
      .and(
        'contain',
        'John Doe (john.doe@test.justice.gov.uk) has been notified, and we have sent a copy of your allocation instructions to example.admin@justice.gov.uk, example.admin@justice.gov.uk'
      )
      .and('contain', 'the initial appointment is scheduled for 1 Sep 2021')
  })

  it('When no Initial appointment date booked, Initial appointment date due by date visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCaseOverviewNoInitialAppointment')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
    cy.get('#person\\[0\\]\\[email\\]').type('example.admin@justice.gov.uk')
    cy.get('.moj-add-another__add-button').click()
    cy.get('#person\\[1\\]\\[email\\]').type('example.admin@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails')
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'the initial appointment needs to be scheduled by 8 Sep 2021')
  })

  it('When a custody case, Initial appointment date not needed visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCaseOverviewCustodyCase')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    cy.get('#instructions').type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'no initial appointment needed (custody case)')
      .and('contain', 'John Doe (john.doe@test.justice.gov.uk) has been notified')
  })
})
