import Page from '../pages/page'
import AllocationCompletePage from '../pages/allocationComplete'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import ErrorPage from '../pages/error'
import SummaryPage from '../pages/summary'

context('Allocate Complete', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/instructions')
  })

  it('return to unallocated cases of team link exists', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetAllocationCompleteDetails')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .returnToUnallocatedLink()
      .should('have.text', 'Return to unallocated cases')
      .and('have.attr', 'href', '/pdu/PDU1/find-unallocated')
  })

  it('panel visible on page with correct information', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetAllocationCompleteDetails')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('have.text', '\n    Allocation complete\n  ')
    allocationCompletePage
      .panelBody()
      .should('have.text', '\n    Dylan Adam Armstrong (J678910) has been allocated to John Doe (PO)\n  ')
  })

  it('What happens next with multiple emails supplied, opting out of copy content visible on page', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.emailInput(0).type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.emailInput(1).type('example.two@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubGetAllocationCompleteDetails')
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
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.emailInput(0).type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.emailInput(1).type('example.two@justice.gov.uk')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', true)
    cy.task('stubGetAllocationCompleteDetails')
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
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetAllocationCompleteDetails')
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
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase', false)
    cy.task('stubGetAllocationCompleteDetails')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'John Doe (john.doe@test.justice.gov.uk) has been notified')
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(localStorage.getItem('instructions-save-J678910-1')).to.be.null
      })
  })

  it('When no Initial appointment date booked, Initial check with your team visible on page', () => {
    cy.reload()
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetAllocationCompleteDetailsNoInitialAppointment')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'no date found for the initial appointment, please check with your team')
  })

  it('When a custody case, Initial appointment date not needed visible on page', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubAllocateOffenderManagerToCase')
    cy.task('stubGetAllocationCompleteDetailsCustody')
    cy.get('.allocate').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'no initial appointment needed (custody case)')
      .and('contain', 'John Doe (john.doe@test.justice.gov.uk) has been notified')
  })

  it('must keep instruction text after an errored allocation', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubErrorAllocateOffenderManagerToCase')
    cy.get('.allocate').click()
    Page.verifyOnPage(ErrorPage)
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('have.value', 'Test')
  })
})
