import Page from '../pages/page'
import SpoOversightPage from '../pages/spoOversight'
import SpoOversightOptionPage from '../pages/spoOversightOption'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import InstructionsConfirmPageRestricted from '../pages/confirmInstructionsRestricted'

context('Instructions Confirmation', () => {
  let oversightOptionPage: SpoOversightOptionPage
  let spoOversightPage: SpoOversightPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    instructionsConfirmPage.continueButton('1').click()
    oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)
    oversightOptionPage.editButton().click()
    spoOversightPage = Page.verifyOnPage(SpoOversightPage)
  })

  it('Offender details visible on page', () => {
    spoOversightPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    spoOversightPage.sectionBreak().should('exist')
  })

  it('Breadcrumbs visible on page', () => {
    spoOversightPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Choose practitioner')
      .and('contain', 'Allocate to practitioner')
  })

  it('Allocate Case button visible on page', () => {
    spoOversightPage.continueButton('1').should('exist').and('contain', 'continue')
  })

  it('Instructions textArea should be visible on page', () => {
    spoOversightPage.instructionsTextArea().should('exist').and('have.attr', 'rows', '20')
    spoOversightPage.subHeading().should('contain', 'Create an SPO Oversight contact')
    spoOversightPage.checkboxText().should('contain', 'Yes, it contains sensitive information')
  })

  it('entering link in allocation notes errors', () => {
    spoOversightPage.instructionsTextArea().type('https://bbc.co.uk/noway')
    spoOversightPage.continueButton('1').click()
    spoOversightPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the spo oversight contact')
  })

  it('entering link without scheme but with www in allocation notes errors', () => {
    spoOversightPage.instructionsTextArea().type('www.bbc.co.uk/noway')
    spoOversightPage.continueButton('1').click()
    spoOversightPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the spo oversight contact')
  })

  it('technical updates banner remains hidden after loading page', () => {
    spoOversightPage.hideMessageLink().click()
    cy.reload()
    spoOversightPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })

  it('if lao case then display restricted access badge', () => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    const instructionsConfirmPageRestricted = Page.verifyOnPage(InstructionsConfirmPageRestricted)
    instructionsConfirmPageRestricted.restrictedStatusBadge().should('exist')
  })

  it('if lao case then display additional text', () => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    const instructionsConfirmPageRestricted = Page.verifyOnPage(InstructionsConfirmPageRestricted)
    instructionsConfirmPageRestricted
      .restrictedStatusWarningTextForEmail()
      .should(
        'contain',
        'These notes will not be included in the email to the probation practitioner as this is a restricted case.'
      )
  })
})
