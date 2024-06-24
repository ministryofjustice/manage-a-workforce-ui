import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/confirmInstructions'

context('Instructions Confirmation', () => {
  let instructionsPage: InstructionsConfirmPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/instructions')
    instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
  })

  it('Offender details visible on page', () => {
    instructionsPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    instructionsPage.sectionBreak().should('exist')
  })

  it('Breadcrumbs visible on page', () => {
    instructionsPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Choose practitioner')
      .and('contain', 'Allocate to practitioner')
      .and('contain', 'Explain your decision')
  })

  it('Allocate Case button visible on page', () => {
    instructionsPage.continueButton('1').should('exist').and('have.text', '\n  Allocate case\n')
  })

  it('Continue button goes to next page', () => {
    instructionsPage.continueButton('1').click()
    cy.url().should('include', '/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/confirm-allocation')
  })

  it('Cancel link visible on page', () => {
    instructionsPage.cancelLink('J678910', '1', 'PDU1').should('exist').and('have.text', 'Cancel')
  })

  it('Instructions textArea should be visible on page', () => {
    instructionsPage.instructionsTextArea().should('exist').and('have.attr', 'rows', '20')
    instructionsPage.subHeading().should('contain', 'Review allocation instructions')
    instructionsPage
      .label()
      .should('contain', "We'll send a copy of these notes to you and John Doe (john.doe@test.justice.gov.uk).")
    instructionsPage.hint().should('contain', 'Review your notes for the probation practitioner.')
    instructionsPage.checkboxText().should('contain', 'Tick the box if you do not want to receive a copy.')
  })

  it('another copy text should be visible on page', () => {
    instructionsPage
      .copyText()
      .should('contain', 'You can send a copy of these notes to another person, for example a case admin officer.')
  })

  it('add another recipient should be visible on page', () => {
    instructionsPage.addRecipientHeader().should('contain', 'Add another recipient')
  })

  it('adding another person adds more email address inputs', () => {
    instructionsPage.inputTexts().should('have.length', 1)
    instructionsPage.addAnotherPersonButton().click()
    instructionsPage.inputTexts().should('have.length', 2)
  })

  it('entering link in allocation notes errors', () => {
    instructionsPage.instructionsTextArea().type('https://www.bbc.co.uk/noway')
    instructionsPage.continueButton('1').click()
    instructionsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem You cannot include links in the allocation notes')
  })

  it('entering link without protocol in allocation notes errors', () => {
    instructionsPage.instructionsTextArea().type('bbc.co.uk/noway')
    instructionsPage.continueButton('1').click()
    instructionsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem You cannot include links in the allocation notes')
  })

  it('entering any link allocation notes errors', () => {
    instructionsPage.instructionsTextArea().type('this is a link bbc.co.uk')
    instructionsPage.continueButton('1').click()
    instructionsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem You cannot include links in the allocation notes')
  })

  it('technical updates banner remains hidden after loading page', () => {
    instructionsPage.hideMessageLink().click()
    cy.reload()
    instructionsPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })
})
