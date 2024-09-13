import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/confirmInstructions'

context('Auto Complete Email', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
  })

  it('options drop down appears when typing', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0, 0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0, 0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
  })

  it('no results text shown when no results returned from search', () => {
    cy.task('stubSearchStaffNoResults')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('no')
    instructionsConfirmPage.firstAutoCompleteOption(0).should('have.text', 'No results found')
  })

  it('scroll to last auto complete input when add another clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0, 0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0, 0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.lastInputText().scrollIntoView()
  })

  it('scroll to last auto complete input when remove clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0, 0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0, 0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.removeButton().first().click()
    instructionsConfirmPage.lastAddAnotherPersonButton().scrollIntoView()
  })
})
