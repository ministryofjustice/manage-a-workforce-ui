import Page from '../pages/page'
import AllocationCompletePage from '../pages/allocationComplete'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import SpoOversightPage from '../pages/spoOversight'

context('Allocate Complete', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
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

  it('What happens next with multiple emails supplied, opting out of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSendComparisionLogToWorkload')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.checkbox().check()
    instructionsConfirmPage.emailInput(0).type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.emailInput(1).type('example.two@justice.gov.uk')
    instructionsConfirmPage.continueButton('1').click()
    const spoOversightPage = Page.verifyOnPage(SpoOversightPage)
    spoOversightPage.continueButton('1').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage.mediumHeading().should('contain', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should('contain', 'the case and SPO Oversight contact will be saved in NDelius within 5 minutes')
      .and(
        'contain',
        'we have sent a copy of the allocation email to example.one@justice.gov.uk, example.two@justice.gov.uk'
      )
      .and('contain', 'the initial appointment is scheduled for 1 September 2021')
  })

  it('What happens next with multiple emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', true)
    cy.task('stubSendComparisionLogToWorkload')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')

    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.emailInput(0).type('example.one@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.emailInput(1).type('example.two@justice.gov.uk')
    instructionsConfirmPage.continueButton('1').click()
    const spoOversightPage = Page.verifyOnPage(SpoOversightPage)
    spoOversightPage.continueButton('1').click()
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage.panelTitle().should('contain', 'Case allocated')
    allocationCompletePage.mediumHeading().should('contain', 'What happens next')
    allocationCompletePage
      .bulletedList()
      .should(
        'contain',
        'we have sent a copy of the allocation email to example.one@justice.gov.uk, example.two@justice.gov.uk'
      )
  })

  it('What happens next with no additional emails supplied, opting in of copy content visible on page', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocation-complete')
    const allocationCompletePage = Page.verifyOnPage(AllocationCompletePage)
    allocationCompletePage
      .bulletedList()
      .should('contain', 'your allocation notes have been emailed to John Doe (john.doe@test.justice.gov.uk)')
      .and('contain', 'the case and SPO Oversight contact will be saved in NDelius within 5 minutes')
      .and('contain', 'the initial appointment is scheduled for 1 September 2021 with John Doe PO')
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
        // eslint-disable-next-line no-unused-expressions
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

  // it('must keep instruction text after an errored allocation', () => {
  //   const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
  //   instructionsConfirmPage.instructionsTextArea().type('Test')
  //   cy.task('stubErrorAllocateOffenderManagerToCase')
  //   instructionsConfirmPage.continueButton('1').click()
  //   Page.verifyOnPage(ErrorPage)
  //   cy.task('stubGetUnallocatedCase')
  //   cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
  //   const summaryPage = Page.verifyOnPage(SummaryPage)
  //   summaryPage.instructionsTextArea().should('have.value', 'Test')
  // })

  // it('must send evidence when it exists', () => {
  //   cy.task('stubGetDecisionEvidencing')
  //   cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/decision-evidencing')
  //   // const decisionEvidencingPage = Page.verifyOnPage(DecisionEvidencingPage)
  //   // decisionEvidencingPage.evidenceText().type('Some Evidences')
  //   // decisionEvidencingPage.radioButton('false').click()
  //   // decisionEvidencingPage.button().click()
  //   const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
  //   cy.task('stubAllocateOffenderManagerToCaseWithEvidence')
  //   cy.task('stubGetAllocationCompleteDetailsCustody')
  //   instructionsConfirmPage.continueButton('1').click()
  //   Page.verifyOnPage(AllocationCompletePage)
  // })
})
