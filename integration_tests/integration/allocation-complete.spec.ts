import Page from '../pages/page'
import AllocationCompletePage from '../pages/allocationComplete'
import InstructionsConfirmPage from '../pages/confirmInstructions'

context('Allocate Complete', () => {
  beforeEach(() => {
    cy.task('stubSetup')
  })

  it('return to unallocated cases of team link exists', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .returnToUnallocatedLink()
      .should('have.text', 'Return to unallocated cases')
      .and('have.attr', 'href', '/team/TM1/cases/unallocated')
  })

  it('panel visible on page with correct information', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage
      .panelBody()
      .should('have.text', '\n    Dylan Adam Armstrong (J678910) has been allocated to John Doe (PO)\n  ')
  })

  it('What happens next with multiple emails supplied, opting out of copy content visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    cy.get('#person\\[0\\]\\[email\\]').type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    cy.get('#person\\[1\\]\\[email\\]').type('example.two@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage.mediumHeading().should('have.text', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should('contain', 'this case will be updated in NDelius within 5 minutes')
      .and('contain', "you'll need to create a Management Oversight contact separately")
      .and(
        'contain',
        'John Doe (john.doe@test.justice.gov.uk) has been notified, and we have sent a copy of your allocation instructions to example.one@justice.gov.uk, example.two@justice.gov.uk'
      )
      .and('contain', 'the initial appointment is scheduled for 1 September 2021')
  })

  it('What happens next with multiple emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.get('#person\\[0\\]\\[email\\]').type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    cy.get('#person\\[1\\]\\[email\\]').type('example.two@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', true)
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage.mediumHeading().should('have.text', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should(
        'contain',
        'John Doe (john.doe@test.justice.gov.uk) has been notified, and we have sent a copy of your allocation instructions to you and example.one@justice.gov.uk, example.two@justice.gov.uk'
      )
  })

  it('What happens next with no additional emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should(
        'contain',
        "John Doe (john.doe@test.justice.gov.uk) has been notified, and we've sent you a copy of your allocation instructions"
      )
  })

  it('What happens next with no additional emails supplied, opting out of copy content visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase', false)
    cy.task('stubGetPersonById')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.bulletedList().should('contain', 'John Doe (john.doe@test.justice.gov.uk) has been notified')
  })

  it('When no Initial appointment date booked, Initial appointment date due by date visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCaseOverviewNoInitialAppointment')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetPersonById')
    cy.task('stubGetUnallocatedCase')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'the initial appointment needs to be scheduled by 8 September 2021')
  })

  it('When a custody case, Initial appointment date not needed visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCaseOverviewCustodyCase')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
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
