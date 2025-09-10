import Page from '../pages/page'
import AllocationCompletePage from '../pages/allocationComplete'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import SpoOversightOptionPage from '../pages/spoOversightOption'
import SpoOversightPage from '../pages/spoOversight'
import ErrorPage from '../pages/error'
import SummaryPage from '../pages/summary'

context('Allocate Complete', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
  })

  it('return to unallocated cases if team link exists', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .returnToUnallocatedLink()
      .should('have.text', 'Return to unallocated cases')
      .and('have.attr', 'href', '/pdu/PDU1/find-unallocated')
  })

  it('panel visible on page with correct information', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage
      .panelBody()
      .should('contain', 'Dylan Adam Armstrong (J678910) has been allocated to John Doe (PO)')
  })

  it('panel visible on page with correct information apostrophe in name', () => {
    cy.task('stubGetApostropheAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage
      .panelBody()
      .should('contain', "Dylan Adam O'Armstrong (J678910) has been allocated to John Doe (PO)")
  })

  it('What happens next with multiple emails supplied, opting out of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubNotFoundEventManagerDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSearchStaff')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.inputTexts().first().type('se')
    instructionsConfirmPage.autoCompleteOption(1).should('have.text', 'second@justice.gov.uk - Second Name')
    instructionsConfirmPage.autoCompleteOption(1).click()

    instructionsConfirmPage.continueButton('1').click()
    const oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)

    oversightOptionPage.saveButton().click()

    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage.mediumHeading().should('contain', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should('exist')
      .and('contain', 'the case and SPO Oversight contact will be saved in NDelius within 5 minutes')
      .and('contain', 'we have sent a copy of the allocation email to first@justice.gov.uk, second@justice.gov.uk')
    // .and('contain', 'the initial appointment is scheduled for 1 September 2021 with John Doe PO')
  })

  it('What happens next with multiple emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubNotFoundEventManagerDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmailsNumericEvent', { sendCopy: true, laoStatus: false })
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubSearchStaff')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.inputTexts().first().type('se')
    instructionsConfirmPage.autoCompleteOption(1).should('have.text', 'second@justice.gov.uk - Second Name')
    instructionsConfirmPage.autoCompleteOption(1).click()
    instructionsConfirmPage.continueButton('1').click()
    const oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)
    oversightOptionPage.editButton().click()
    const spoOversightPage = Page.verifyOnPage(SpoOversightPage)
    spoOversightPage.saveButton().click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage.mediumHeading().should('contain', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should('contain', 'we have sent a copy of the allocation email to first@justice.gov.uk, second@justice.gov.uk')
  })

  it('What happens next with no additional emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('exist')
      .and('contain', 'your allocation notes have been emailed to John Doe (john.doe@test.justice.gov.uk)')
      .and('contain', 'the case and SPO Oversight contact will be saved in NDelius within 5 minutes')
    // .and('contain', 'the initial appointment is scheduled for 1 September 2021 with John Doe PO')
  })

  it('What happens next with no additional emails supplied, opting out of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetailsNoInitialAppointment')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'your allocation notes have been emailed to John Doe (john.doe@test.justice.gov.uk)')
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(localStorage.getItem('instructions-save-J678910-1')).to.be.null
      })
  })

  it('When no Initial appointment date booked, Initial check with your team visible on page', () => {
    cy.task('stubGetAllocationCompleteDetailsNoInitialAppointment')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'no date found for the initial appointment, please check with your team')
  })

  it('When a custody case, Initial appointment not visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .contains('your allocation notes have been emailed to John Doe (john.doe@test.justice.gov.uk)')
      .contains('the initial appointment is scheduled for ')
      .should('not.exist')
  })

  it('When a license case, Initial appointment not visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .contains('your allocation notes have been emailed to John Doe (john.doe@test.justice.gov.uk)')
      .contains('the initial appointment is scheduled for ')
      .should('not.exist')
  })

  it('must keep instruction text after an errored allocation', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubNotFoundEventManagerDetails')
    cy.task('stubErrorAllocateOffenderManagerToCase')
    cy.task('stubSearchStaff')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.inputTexts().first().type('se')
    instructionsConfirmPage.autoCompleteOption(1).should('have.text', 'second@justice.gov.uk - Second Name')
    instructionsConfirmPage.autoCompleteOption(1).click()
    instructionsConfirmPage.continueButton('1').click()
    const oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)

    oversightOptionPage.saveButton().click()
    Page.verifyOnPage(ErrorPage)
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('have.value', 'Test')
  })

  it('user tries to submit allocation twice in quick succession', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubNotFoundEventManagerDetails')
    cy.task('stubErrorAllocateOffenderManagerToCase')
    cy.task('stubSearchStaff')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.inputTexts().first().type('se')
    instructionsConfirmPage.autoCompleteOption(1).should('have.text', 'second@justice.gov.uk - Second Name')
    instructionsConfirmPage.autoCompleteOption(1).click()
    instructionsConfirmPage.continueButton('1').click()
    const oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)

    oversightOptionPage.saveButton().click()
    // adding in some thinking time for the user to consider their action
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.go('back')
    oversightOptionPage.saveButton().click()

    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
  })
})
