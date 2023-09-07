import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/confirmInstructions'

context('Auto Complete Email', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/instructions')
  })

  it('options drop down appears when typing', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.emailInput(0).type('fi')
    instructionsConfirmPage.autoCompleteOption(0, 0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0, 0).click()
    instructionsConfirmPage.emailInput(0).should('have.value', 'first@justice.gov.uk')
  })

  it('no results text shown when no results returned from search', () => {
    cy.task('stubSearchStaffNoResults')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.emailInput(0).type('no')
    instructionsConfirmPage.firstAutoCompleteOption(0).should('have.text', 'No results found')
  })

  it('able to manually input email when there is an error', () => {
    cy.task('stubSearchStaffError')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.emailInput(0).type('ma')
    instructionsConfirmPage
      .autoCompleteOption(0, 0)
      .should('have.text', 'This function is unavailable, please try again later')
    instructionsConfirmPage.emailInput(0).type('nual@justice.gov.uk')
    instructionsConfirmPage.emailInput(0).blur()
    instructionsConfirmPage.emailInput(0).should('have.value', 'manual@justice.gov.uk')
  })

  it('scroll to last auto complete input when add another clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.lastInputText().scrollIntoView()
  })

  it('scroll to last auto complete input when remove clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.removeButton(2).click()
    instructionsConfirmPage.lastAddAnotherPersonButton().scrollIntoView()
  })
})
