import Page from '../pages/page'
import SpoOversightPage from '../pages/spoOversight'

context('Instructions Confirmation', () => {
  let spoOversightPage: SpoOversightPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/spo-oversight-contact')
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
})