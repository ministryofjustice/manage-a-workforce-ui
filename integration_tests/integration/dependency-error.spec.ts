import Page from '../pages/page'
import DependencyErrorPage from '../pages/dependencyError'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import SpoOversightOptionPage from '../pages/spoOversightOption'

context('Dependency 424 error', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
  })

  it('must display 424 error page when 524 error status returned', () => {
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubNotFoundEventManagerDetails')
    cy.task('stub424ErrorAllocateOffenderManagerToCase')
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
    Page.verifyOnPage(DependencyErrorPage)
    const dependencyErrorPage = Page.verifyOnPage(DependencyErrorPage)
    dependencyErrorPage.heading().contains('This service is temporarily unavailable')
    dependencyErrorPage
      .bodyText()
      .contains('There is a problem with another service that Allocate a Person on Probation relies upon.')
    dependencyErrorPage
      .bodyText()
      .contains('Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).')
    dependencyErrorPage.bodyText().contains('If the page still does not load, try again later.')
  })
})
