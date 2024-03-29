import Page, { PageElement } from './page'

export default class InstructionsConfirmPage extends Page {
  constructor() {
    super('Review allocation instructions')
  }

  continueButton = (convictionNumber): PageElement => cy.get(`#${convictionNumber}`)

  label = (): PageElement => cy.get('.govuk-label')

  hint = (): PageElement => cy.get('.govuk-hint')

  copyText = (): PageElement => cy.get('#copyText')

  addRecipientHeader = (): PageElement => cy.get('.moj-add-another__title')

  addAnotherPersonButton = (): PageElement => cy.get('button[value*="add-another-person"]')

  lastAddAnotherPersonButton = (): PageElement => cy.get('button[value*="add-another-person"]').last()

  lastInputText = (): PageElement => cy.get('input').last()

  removeButton = (index): PageElement => cy.get(`button[value*="${index}"]`)

  inputTexts = (): PageElement => cy.get('input.autocomplete__input')

  cancelLink = (crn, convictionNumber, pduCode): PageElement =>
    cy.get(`a[href*="/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/choose-practitioner"]`).eq(1)

  checkboxText = (): PageElement => cy.get('.govuk-checkboxes__label')

  checkbox = (): PageElement => cy.get('#emailCopy')

  emailInput = (index): PageElement => cy.get(`input[id="person\\[${index}\\]\\[email\\]"]`)

  autoCompleteOption = (emailInputIndex, optionIndex): PageElement =>
    cy.get(`#person\\[${emailInputIndex}\\]\\[email\\]__option--${optionIndex}`)

  firstAutoCompleteOption = (emailInputIndex): PageElement =>
    cy.get(`ul[id="person\\[${emailInputIndex}\\]\\[email\\]__listbox"]:first`)
}
