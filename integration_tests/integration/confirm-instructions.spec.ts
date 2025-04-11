import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import InstructionsConfirmPageRestricted from '../pages/confirmInstructionsRestricted'

context('Instructions Confirmation', () => {
  let instructionsPage: InstructionsConfirmPage
  let instructionsPageRestricted: InstructionsConfirmPageRestricted
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
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
  })

  it('Allocate Case button visible on page', () => {
    instructionsPage.continueButton('1').should('exist').and('contain', 'continue')
  })

  it('Continue button goes to next page', () => {
    instructionsPage.instructionsTextArea().type('some text')
    instructionsPage.continueButton('1').click()
    cy.url().should('include', '/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/spo-oversight-contact')
  })

  it('Cancel link visible on page', () => {
    instructionsPage.cancelLink('J678910', '1', 'PDU1').should('exist').and('have.text', 'Cancel')
  })

  it('Instructions textArea should be visible on page', () => {
    instructionsPage.instructionsTextArea().should('exist').and('have.attr', 'rows', '20')
    instructionsPage.subHeading().should('contain', 'Review your allocation notes')
    // instructionsPage.hint().should('contain', 'These notes will be sent in the allocation email')
    instructionsPage.checkboxText().should('contain', 'Tick the box if you do not want to receive a copy.')
  })

  it('add another recipient should be visible on page', () => {
    instructionsPage.addRecipientHeader().should('contain', 'Add another recipient')
  })

  it('adding another person adds more email address inputs', () => {
    cy.task('stubSearchStaff')

    instructionsPage.inputTexts().should('have.length', 1)
    instructionsPage.inputTexts().first().type('john.doe')
    instructionsPage.emailAutocompleteItem().click()
    instructionsPage.addAnotherPersonButton().should('have.length', 1)
    instructionsPage.addAnotherPersonButton().click()
    instructionsPage.hiddenInputTexts().should('have.length', 1)
  })

  it('entering link in allocation notes errors', () => {
    instructionsPage.instructionsTextArea().type('https://bbc.co.uk/noway')
    instructionsPage.continueButton('1').click()
    instructionsPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the allocation notes')
  })

  it('entering link without scheme but with www in allocation notes errors', () => {
    instructionsPage.instructionsTextArea().type('www.bbc.co.uk/noway')
    instructionsPage.continueButton('1').click()
    instructionsPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the allocation notes')
  })

  it('technical updates banner remains hidden after loading page', () => {
    instructionsPage.hideMessageLink().click()
    cy.reload()
    instructionsPage.technicalUpdatesBanner().should('have.class', 'moj-hidden')
  })

  it('For Lao Case restricted access badge appears', () => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    instructionsPageRestricted = Page.verifyOnPage(InstructionsConfirmPageRestricted)
    instructionsPageRestricted.restrictedStatusBadge().should('exist')
  })

  it('For Lao Case warning text that notes not sent in email appears', () => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
    instructionsPageRestricted = Page.verifyOnPage(InstructionsConfirmPageRestricted)
    instructionsPageRestricted
      .restrictedStatusWarningTextForEmail()
      .should(
        'contain',
        'These notes will not be included in the email to the probation practitioner as this is a restricted access case.',
      )
  })
})
