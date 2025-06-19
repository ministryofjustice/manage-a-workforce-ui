import Page from '../pages/page'
import SpoOversightOptionPage from '../pages/spoOversightOption'
import InstructionsConfirmPage from '../pages/confirmInstructions'
import ForbiddenPage from '../pages/forbidden'

context('Instructions Confirmation', () => {
  let oversightOptionPage: SpoOversightOptionPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubSearchStaff')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubGetAllocationCompleteDetails')
    cy.task('stubAllocateOffenderManagerToCaseMultipleEmails', false)
    cy.task('stubSendComparisonLogToWorkload')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/allocation-notes')
  })

  it('No access when crn in forbidden region on tardis page', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 403 })
    instructionsConfirmPage.continueButton('1').click()
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
    forbiddenPage.heading().should('exist')
  })

  it('No access when crn in forbidden region on oversight edit page', () => {
    const instructionsConfirmPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsConfirmPage.instructionsTextArea().type('Test')
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    instructionsConfirmPage.continueButton('1').click()
    oversightOptionPage = Page.verifyOnPage(SpoOversightOptionPage)
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 403 })
    oversightOptionPage.editButton().click()
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
    forbiddenPage.heading().should('exist')
  })
})
