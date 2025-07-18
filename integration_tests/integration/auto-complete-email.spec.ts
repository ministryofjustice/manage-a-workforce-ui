import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/confirmInstructions'

context('Auto Complete Email', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })

    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
  })

  it('options drop down appears when typing', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
  })

  it('no results text shown when no results returned from search', () => {
    cy.task('stubSearchStaffNoResults')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('no')
    instructionsConfirmPage.firstAutoCompleteOption().should('have.text', 'No results found')
  })

  it('scroll to last auto complete input when add another clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.lastInputText().scrollIntoView()
  })

  it('scroll to last auto complete input when remove clicked', () => {
    cy.task('stubSearchStaff')
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.inputTexts().first().type('fi')
    instructionsConfirmPage.autoCompleteOption(0).should('have.text', 'first@justice.gov.uk - First Name')
    instructionsConfirmPage.autoCompleteOption(0).click()
    instructionsConfirmPage.inputTexts().first().should('have.value', 'first@justice.gov.uk')
    instructionsConfirmPage.addAnotherPersonButton().click()
    instructionsConfirmPage.removeButton().first().click()
    instructionsConfirmPage.lastAddAnotherPersonButton().scrollIntoView()
  })
})
