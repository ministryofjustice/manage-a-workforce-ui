import Page from '../pages/page'
import ChooseEmailRecipientsPage from '../pages/ChooseEmailRecipients'

context('Choose email recipients', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetSavedEmails')
    cy.task('stubGetConfirmInstructions')
    cy.task('stubSearchStaff')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubGetEventManagerDetails')
    cy.task('stubForFeatureflagEnabled')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM1/choose-email-recipients', { failOnStatusCode: false })
    // /pdu/WPTNWS/Y001203/convictions/2/allocate/N03C01/N57A042/choose-email-recipients
  })

  it('display email recipient page', () => {
    Page.verifyOnPage(ChooseEmailRecipientsPage)
  })

  it('displays saved emails', () => {
    const chooseEmailRecipientsPage = Page.verifyOnPage(ChooseEmailRecipientsPage)
    chooseEmailRecipientsPage.savedEmailsList().should('contain.text', 'first@justice.gov.uk')
    chooseEmailRecipientsPage.savedEmailsList().should('contain.text', 'second@justice.gov.uk')
    chooseEmailRecipientsPage.savedEmailsList().should('contain.text', 'third@justice.gov.uk')
  })

  it('adds email recipients', () => {
    const chooseEmailRecipientsPage = Page.verifyOnPage(ChooseEmailRecipientsPage)
    chooseEmailRecipientsPage.autocomplete().type('first@justice.gov.uk')
    chooseEmailRecipientsPage.autocompleteList().first().should('contain.text', 'first@justice.gov.uk')
    chooseEmailRecipientsPage.autocompleteList().first().click()
    chooseEmailRecipientsPage.addRecipientBtn().click()
    chooseEmailRecipientsPage.recipientList().should('contain.text', 'first@justice.gov.uk')
    chooseEmailRecipientsPage
      .savedEmailsList()
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should('be.checked')
      })
  })

  it('removes email recipients', () => {
    const chooseEmailRecipientsPage = Page.verifyOnPage(ChooseEmailRecipientsPage)
    chooseEmailRecipientsPage.autocomplete().type('first@justice.gov.uk')
    chooseEmailRecipientsPage.autocompleteList().first().should('contain.text', 'first@justice.gov.uk')
    chooseEmailRecipientsPage.autocompleteList().first().click()
    chooseEmailRecipientsPage.addRecipientBtn().click()
    chooseEmailRecipientsPage
      .recipientList()
      .first()
      .within(() => {
        cy.get('a').click()
      })

    chooseEmailRecipientsPage.recipientList().should('not.contain.text', 'first@justice.gov.uk')

    chooseEmailRecipientsPage
      .savedEmailsList()
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').should('not.be.checked')
      })
  })

  it('displays errors when lists fail to load', () => {
    cy.task('stubGetSavedEmailsError')
    const chooseEmailRecipientsPage = Page.verifyOnPage(ChooseEmailRecipientsPage)
    chooseEmailRecipientsPage.errorMessage().should('have.length', 2)
  })
})
